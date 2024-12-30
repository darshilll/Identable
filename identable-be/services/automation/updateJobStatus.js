import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;
import { POST_STATUS } from "../../utilities/constants";

export const updateJobStatus = async (entry) => {
  let {
    body: { jobRequestId, response },
  } = entry;

  const jobData = await dbService.findOneRecord("JobRequestModel", {
    _id: ObjectId(jobRequestId),
  });

  if (!jobData) {
    throw new Error("Invalid Job Request Id");
  }

  if (
    response?.status == "failed" &&
    (response?.data?.error_type == "INVALID_COOKIES" ||
      response?.data?.error == "LoginFailedException")
  ) {
    await dbService.updateOneRecords(
      "UserModel",
      {
        _id: jobData?.userId,
      },
      {
        isCookieValid: false,
      }
    );

    await dbService.updateOneRecords(
      "BotModel",
      {
        userId: jobData?.userId,
      },
      {
        isCookieValid: false,
      }
    );
  }
  if (
    jobData?.requestData?.job_type == "SCHEDULE_POST" ||
    jobData?.requestData?.job_type == "SCHEDULE_ARTICLE"
  ) {
    if (response?.status == "success") {
      await dbService.updateOneRecords(
        "PostModel",
        { _id: ObjectId(jobData?.requestData?.post_id) },
        {
          status: POST_STATUS.POSTED,
          postUrl: response?.data?.postUrl,
          linkedinPostId: response?.data?.linkedinPostId,
        }
      );
    } else if (response?.status == "failed") {
      await dbService.updateOneRecords(
        "PostModel",
        { _id: ObjectId(jobData?.requestData?.post_id) },
        {
          status: POST_STATUS.ERROR,
        }
      );
    }
  }

  let obj = {
    responseData: response,
    responseAt: Date.now(),
    status: response?.status,
  };

  await dbService.updateOneRecords(
    "JobRequestModel",
    { _id: jobRequestId },
    obj
  );

  return "Job Response Saved Successfully";
};
