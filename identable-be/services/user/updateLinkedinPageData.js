import multer from "multer";
import multerS3 from "multer-s3";
import AWS from "aws-sdk";
import dbService from "../../utilities/dbService";
import { validateProfilePhoto } from "../../utilities/faceAnalyzeService";
import { scrapeLinkedinOptimization } from "../../utilities/jobs/scrapeLinkedinOptimization";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  endpoint: process.env.BUCKET_ENDPOINT,
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    acl: "public-read",
    key: (entry, file, cb) => {
      const userId = entry.user?._id || "default-user";
      const fileType =
        file.fieldname === "profilePhoto" ? "profile-photo" : "cover-photo";
      const fileName = `${userId}/${fileType}-${Date.now()}-${
        file.originalname
      }`;
      cb(null, fileName);
    },
  }),
});

export const uploadS3Files = upload.fields([
  { name: "profilePhoto", maxCount: 1 },
  { name: "coverPhoto", maxCount: 1 },
]);

export const updateLinkedinPageData = async (entry) => {
  try {
    const {
      user: { _id: userId },
      files,
      body: { profileUrl }, 
    } = entry;
    const linkedInPageData = await dbService.findOneRecord(
      "LinkedinPageModel",
      { userId }
    );

    if (!linkedInPageData) {
      return {
        statusCode: 404,
        message: "LinkedIn Page not found.",
      };
    }
    const userDetails = await dbService.findOneRecord("UserModel", {
      _id: userId,
    });

    if (!userDetails) {
      return {
        statusCode: 404,
        message: "User not found.",
      };
    }

    const { cookies, cookiesExpiry, userAgent, proxy } = userDetails;

    let updatedFields = {};
    let optimizeActions = [];

    // Handle Profile Photo
    if (files?.profilePhoto?.[0]) {
      const profilePhotoUrl = files.profilePhoto[0].location;
      const photoValidation = await validateProfilePhoto(profilePhotoUrl);

      if (photoValidation.isValid) {
        updatedFields.image = profilePhotoUrl;
        optimizeActions.push({
          action: "uploadProfileImage",
          value: profilePhotoUrl,
        });
      } else {
        return {
          statusCode: 400,
          message: `Invalid profile photo. ${photoValidation.message}`,
        };
      }
    }
    if (files?.coverPhoto?.[0]) {
      const coverPhotoUrl = files.coverPhoto[0].location;
      updatedFields.coverImage = coverPhotoUrl;
      optimizeActions.push({
        action: "uploadCoverImage",
        value: coverPhotoUrl,
      });
    }
    if (profileUrl) {
      updatedFields.profileUrl = profileUrl;
      optimizeActions.push({
        action: "profileUrlUpdate",
        value: profileUrl,
      });
    }
    const optimizeSuccess = await scrapeLinkedinOptimization({
      cookies: cookies,
      cookiesExpiry: cookiesExpiry,
      userAgent: userAgent,
      userId: userId,
      pageId: linkedInPageData._id,
      proxy: proxy || "",
      optimizeActions,
    });

    if (optimizeSuccess) {
      const updatedFields = {
        coverImg: optimizeActions.find(
          (action) => action.action === "uploadCoverImage"
        )?.value,
      };
      const updatedLinkedinPage = await dbService.findOneAndUpdateRecord(
        "LinkedinPageModel",
        { userId },
        { $set: updatedFields },
        { returnDocument: "after" }
      );
      if (!updatedLinkedinPage) {
        return {
          message: "Failed to update LinkedIn Page data.",
        };
      }
      return {
        message: "LinkedIn Page updated successfully.",
        data: updatedLinkedinPage,
      };
    }
  } catch (error) {
    return {
      message: "Internal server error.",
    };
  }
};
