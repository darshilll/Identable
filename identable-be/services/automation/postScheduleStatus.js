import dbService from "../../utilities/dbService";
import {
  SUBSCRIPTION_STATUS,
  CANCEL_REASON,
  POST_STATUS,
} from "../../utilities/constants";
const ObjectId = require("mongodb").ObjectID;

export const postScheduleStatus = async (entry) => {
  if (!entry?.body?.postId) {
    throw new Error("postId not found");
  }
  let postId = entry?.body?.postId;

  if (entry?.body?.status == "SCHEDULED_SUCCESSFULLY") {
    await dbService.updateOneRecords(
      "PostModel",
      { _id: ObjectId(postId) },
      {
        status: POST_STATUS.POSTED,
        postUrl: entry?.body?.postUrl,
        linkedinPostId: entry?.body?.linkedinPostId,
      }
    );

    let postData = await dbService.findOneRecord(
      "PostModel",
      { _id: ObjectId(postId) },
      { carouselId: 1 }
    );

    if (postData?.carouselId) {
      await dbService.updateOneRecords(
        "carouselCustomTemplateModel",
        { _id: ObjectId(postData?.carouselId) },
        {
          status: POST_STATUS.POSTED,
        }
      );
    }
  } else {
    let errorMessage = "Something went wrong";
    let errorCode = 500;
    if (entry?.body?.error) {
      errorMessage = entry?.body?.error?.message;
      errorCode = entry?.body?.error?.error_code;
    }
    await dbService.updateOneRecords(
      "PostModel",
      { _id: ObjectId(postId) },
      {
        postError: errorMessage,
        postErrorCode: errorCode,
        status: POST_STATUS.ERROR,
      }
    );

    let postData = await dbService.findOneRecord(
      "PostModel",
      { _id: ObjectId(postId) },
      { carouselId: 1 }
    );

    if (postData?.carouselId) {
      await dbService.updateOneRecords(
        "carouselCustomTemplateModel",
        { _id: ObjectId(postData?.carouselId) },
        {
          status: POST_STATUS.ERROR,
        }
      );
    }
  }

  return "Success";
};
