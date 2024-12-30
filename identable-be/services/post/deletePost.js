import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;

export const deletePost = async (entry) => {
  let {
    body: { postId },
    user: { _id },
  } = entry;

  let postObj = {
    isDeleted: true,
    deletedAt: Date.now(),
  };

  await dbService.updateOneRecords(
    "PostModel",
    { _id: ObjectId(postId) },
    postObj
  );

  return "Post deleted successfully";
};
