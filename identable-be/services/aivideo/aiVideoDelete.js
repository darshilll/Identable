import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;

export const aiVideoDelete = async (entry) => {
  let {
    body: { videoId },
    user: { _id },
  } = entry;

  await dbService.updateOneRecords(
    "AIVideoModel",
    { _id: ObjectId(videoId) },
    {
      isDeleted: true,
    }
  );

  return "AI Video deleted successfully";
};
