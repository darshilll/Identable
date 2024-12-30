import dbService from "../../utilities/dbService";
import { SUBSCRIPTION_STATUS } from "../../utilities/constants";
import { createCommonPrompt } from "../../utilities/openAi";
import { generateOutlineOutputPrompt } from "../openai/generateArticlePrompt";

const ObjectId = require("mongodb").ObjectID;

export const generateOutlineOutput = async (entry) => {
  let {
    body: { title, description, strategicKeywords, searchIntent },
    user: { _id, chatGPTVersion },
  } = entry;

  let result = await generateOutlineOutputPrompt({
    title,
    description,
    strategicKeywords,
    searchIntent,
    userId: _id,
    chatGPTVersion,
  });

  return result;
};
