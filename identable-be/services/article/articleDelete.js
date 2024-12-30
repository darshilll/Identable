import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;

export const articleDelete = async (entry) => {
  let {
    body: { articleId },
    user: { _id },
  } = entry;

  await dbService.updateOneRecords(
    "ArticleModel",
    { _id: ObjectId(articleId) },
    {
      isDeleted: true,
    }
  );

  return "Article deleted successfully";
};
