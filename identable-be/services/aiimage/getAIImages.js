import dbService from "../../utilities/dbService";
import { getNews } from "../../utilities/news";
import { generatePost } from "../post/generatePost";

const ObjectId = require("mongodb").ObjectID;
import { generateKeywordPrompt } from "../openai/generateKeywordPrompt";

export const getAIImages = async (entry) => {
  let {
    user: { _id, chatGPTVersion, currentPageId },
  } = entry;

  let imageData = await dbService.findAllRecords(
    "AIImageModel",
    {
      userId: _id,
      isDeleted: false,
      isEnabled: true,
    },
    {
      imageUrl: 1,
    }
  );

  return imageData;
};
