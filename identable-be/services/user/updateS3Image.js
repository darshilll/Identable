import {
  CONNECTION_JOB_TYPE,
  SUBSCRIPTION_STATUS,
} from "../../utilities/constants";

import dbService from "../../utilities/dbService";

import { scrapeLinkedinUserDataJob } from "../../utilities/automationRequest";

const ObjectId = require("mongodb").ObjectID;

const axios = require("axios");
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

export const updateS3Image = async (entry) => {
  const subscriptionData = await dbService.findAllRecords(
    "SubscriptionModel",
    {
      subscriptionStatus: {
        $in: [SUBSCRIPTION_STATUS.ACTIVE, SUBSCRIPTION_STATUS.TRIAL],
      },
    },
    {
      userId: 1,
    }
  );

  const userIds = subscriptionData?.map((obj) => obj?.userId);

  const linkedinPageData = await dbService.findAllRecords(
    "LinkedinPageModel",
    {
      userId: {
        $in: userIds,
      },
      s3ImageUpdatedAt: {
        $exists: false,
      },
    },
    {
      _id: 1,
      image: 1,
    }
  );
  console.log("linkedinPageData?.length = ", linkedinPageData?.length);

  for (let i = 0; i < linkedinPageData?.length; i++) {
    console.log("i = ", i);

    const element = linkedinPageData[i];

    let s3ImagePath = "linkedinpage/" + element?._id?.toString() + ".jpg";

    let s3Image = await uploadS3Image({
      imageUrl: element?.image,
      s3ImagePath: s3ImagePath,
    });

    await dbService.updateOneRecords(
      "LinkedinPageModel",
      { _id: element?._id },
      {
        s3Image: s3Image,
        s3ImageUpdatedAt: Date.now(),
      }
    );
  }

  return "Success";
};
export const uploadS3Image = async (entry) => {
  let { imageUrl, s3ImagePath } = entry;

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
      Key: s3ImagePath,
      Body: passThrough,
      ContentType: response.headers["content-type"],
      ACL: "public-read",
    };

    const data = await s3.upload(params).promise();
    const image = data?.Location;
    if (!image) {
      return "";
    }
    return image;
  } catch (error) {
    console.error("generateAIImage error = ", error);
    return "";
  }
};

export const updateIntegration = async (entry) => {
  const userArray = await dbService.findAllRecords("UserModel", {
    _id: {
      $in: [
        ObjectId("6620b56192b3bb0030438b92"),
        ObjectId("661d4fec0246d04bd88490ab"),
        ObjectId("65f29246bce8ed00300429df"),
        ObjectId("66ab29003ef0ff0031689a75"),
      ],
    },
  });

  for (let i = 0; i < userArray?.length; i++) {
    const userData = userArray[i];

    let jobResult = await scrapeLinkedinUserDataJob({
      userId: userData?._id,
      cookies: userData?.cookies,
      cookiesExpiry: userData?.cookiesExpiry,
      userAgent: userData?.userAgent,
      proxy: userData?.proxy,
    });
  }
};
