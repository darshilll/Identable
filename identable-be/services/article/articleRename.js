import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;

export const articleRename = async (entry) => {
  let {
    body: { articleTitle, articleId },
    user: { _id },
  } = entry;

  await dbService.updateOneRecords(
    "ArticleModel",
    { _id: ObjectId(articleId) },
    {
      articleTitle: articleTitle,
    }
  );

  return "Article renamed successfully";
};
