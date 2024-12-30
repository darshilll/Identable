import dbService from "../../utilities/dbService";
let request = require("request");
const axios = require("axios");
import { generateImage } from "../../utilities/openAi";
const { PassThrough } = require("stream");

const AWS = require("aws-sdk");

const accessKeyId = process.env.AWS_ACCESS_ID;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const bucketName = process.env.BUCKET_NAME;
const endpoint = process.env.BUCKET_ENDPOINT;

AWS.config.update({
  accessKeyId,
  secretAccessKey,
  endpoint,
});

const s3 = new AWS.S3();

export const generateAIImageAction = async (entry) => {
  let { topic, keywords, userId, pageId, size = "1024x1024", promptVal } = entry;
  
  let prompt = `Create an image that visually represents topic is [${topic}]. Include elements that prominently feature related to topic.`;

  if (promptVal) {
    prompt = promptVal;
  }

  const imageResponse = await generateImage({
    prompt: prompt,
    size: size,
  });

  const createdData = await dbService.createOneRecord("AIImageModel", {
    userId: userId,
    pageId: pageId,
    prompt: prompt,
    responseData: imageResponse,
    isEnabled: false,
    createdAt: Date.now(),
  });

  let imageUrl = "";
  if (imageResponse?.data?.length > 0) {
    imageUrl = imageResponse.data[0].url;
  }

  if (!imageUrl) {
    return "";
  }
  try {
    const response = await axios({
      url: imageUrl,
      method: "GET",
      responseType: "stream",
    });

    const passThrough = new PassThrough();
    response.data.pipe(passThrough);

    const params = {
      Bucket: bucketName,
      Key: userId + "/aiimage/image_" + Date.now() + ".jpg",
      Body: passThrough,
      ContentType: response.headers["content-type"],
      ACL: "public-read",
    };

    const data = await s3.upload(params).promise();
    const image = data?.Location;
    if (!image) {
      return "";
    }

    await dbService.updateOneRecords(
      "AIImageModel",
      { _id: createdData?._id },
      {
        imageUrl: image,
        isEnabled: true,
      }
    );
    return image;
  } catch (error) {
    console.error("generateAIImage error = ", error);
    return "";
  }
};
