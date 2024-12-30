import { getUniqueId } from "../../utilities/generateRandom";

import fs from "fs";
const axios = require("axios");

const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffprobePath = require("@ffprobe-installer/ffprobe").path;
const ffmpeg = require("fluent-ffmpeg");

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

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

export const generateVideoThumbnail = async (entry) => {
  let { videoUrl, thumbUrl } = entry;

  let filePath = "thumb_" + getUniqueId() + ".jpg";
  return new Promise(async function (resolve, reject) {
    try {
      const { width, height } = await getVideoDimensions(videoUrl);
      const size = `${width}x${height}`;
      ffmpeg(videoUrl)
        .on("end", async () => {
          try {
            const thumbnailUrl = await uploadThumbnailToS3(filePath, thumbUrl);

            deleteLocalFile(filePath);

            resolve(thumbnailUrl);
          } catch (error) {
            console.error("generateVideoThumbnail 2 error = ", error);

            deleteLocalFile(filePath);

            resolve("");
          }
        })
        .on("error", (err) => {
          console.error("generateVideoThumbnail 3 error = ", err);
          deleteLocalFile(filePath);

          resolve("");
        })
        .screenshots({
          count: 1,
          filename: filePath,
          size: size,
        });
    } catch (error) {
      console.error("generateVideoThumbnail 4 error = ", error);
      deleteLocalFile(filePath);
      resolve("");
    }
  });
};

const uploadThumbnailToS3 = async (thumbnailPath, thumbUrl) => {
  const fileStream = fs.createReadStream(thumbnailPath);

  const params = {
    Bucket: bucketName,
    Key: thumbUrl,
    Body: fileStream,
    ContentType: "image/jpeg",
    ACL: "public-read",
  };

  const data = await s3.upload(params).promise();
  const image = data?.Location;
  if (!image) {
    return "";
  }

  return image;
};

function getVideoDimensions(videoPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      let width = 480;
      let height = 640;

      try {
        if (err) {
          console.error("getVideoDimensions 1 err = ", err);
        } else {
          for (let i = 0; i < metadata?.streams?.length; i++) {
            const streams = metadata?.streams[i];

            if (streams?.width && streams?.height) {
              width = streams?.width;
              height = streams?.height;
              break;
            }
          }
        }
      } catch (error) {
        console.error("getVideoDimensions 2 error = ", error);
      }

      resolve({ width: width, height: height });
    });
  });
}

function deleteLocalFile(path) {
  try {
    fs.unlink(path, (err) => {
      if (err) console.error("deleteLocalFile 1 error = ", err);
    });
  } catch (error) {
    console.error("deleteLocalFile 2 error = ", err);
  }
}
