import dbService from "../../utilities/dbService";
import {
  POST_GENERATE_TYPE,
  POST_STATUS,
  SUBSCRIPTION_STATUS,
} from "../../utilities/constants";
const ObjectId = require("mongodb").ObjectID;

export const reschedulePost = async (entry) => {
  let {
    body: { scheduleDateTime, timeSlot, timePeriod, postId },
    user: { _id },
  } = entry;

  let currentStart = new Date(scheduleDateTime);
  currentStart.setSeconds(0, 0);

  let currentEnd = new Date(currentStart.getTime() + 29 * 60000);
  currentEnd.setSeconds(0, 0);

  let condition = {
    userId: _id,
    isDeleted: false,
    scheduleDateTime: {
      $gte: currentStart.getTime(),
      $lte: currentEnd.getTime(),
    },
    _id: { $ne: ObjectId(postId) },
  };

  const postData1 = await dbService.findOneRecord("PostModel", condition, {
    _id: 1,
  });

  if (postData1) {
    throw new Error("Post already scheduled for this time.");
  }

  let postObj = {
    scheduleDateTime: scheduleDateTime,
    timeSlot: timeSlot,
    timePeriod: timePeriod,
    status: POST_STATUS.SCHEDULED,
    updatedAt: Date.now(),
  };

  await dbService.updateOneRecords(
    "PostModel",
    { _id: ObjectId(postId) },
    postObj
  );

  return "Post rescheduled successfully";
};
