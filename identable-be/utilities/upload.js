import multer from "multer";
import multerS3 from "multer-s3";
import request from "request";
import path from "path";
let fs = require("fs");

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

const storage = multerS3({
  s3: s3,
  acl: function (req, file, cb) {
    cb(null, "public-read");
  },
  contentType: multerS3.AUTO_CONTENT_TYPE,
  bucket: function (req, file, cb) {
    cb(null, bucketName);
  },
  key: function (req, file, cb) {
    cb(
      null,
      req["user"]["_id"].toString() +
        "/" +
        Date.now() +
        file["originalname"]
    );
  },
});

const upload = multer({
  limits: {
    fileSize: function (req, file, cb) {
      const { query: { type = 0 } = {} } = req;
      switch (type) {
        case 1:
          cb(null, 200000);
          break;
        case 2:
          cb(null, 200000);
          break;
        default:
          cb(null, 200000);
          break;
      }
    },
  }, // FOR 1mb=100000
  fileFilter: function (req, file, cb) {
    let fileTypes = /jpeg|jpg|png|gif|pdf|mp4/; // all case add kr dena top pr
    const { query: { type = 0 } = {} } = req;
    let extname, mimeType;
    fileTypes = /jpeg|jpg|png|gif|pdf|mp4/;
    extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    mimeType = fileTypes.test(file.mimetype);
    if (mimeType && extname) {
      return cb(null, true);
    } else {
      cb("Error: Images Only!");
    }
  },
  storage: storage,
});

export const uploadS3Fn = upload.any();
