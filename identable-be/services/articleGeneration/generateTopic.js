import dbService from "../../utilities/dbService";
import { SUBSCRIPTION_STATUS } from "../../utilities/constants";
import { createCommonPrompt } from "../../utilities/openAi";
import { generateArticleTopicPrompt } from "../openai/generateArticlePrompt";

const ObjectId = require("mongodb").ObjectID;

export const generateTopic = async (entry) => {
  let {
    body: { topic },
    user: { _id, chatGPTVersion },
  } = entry;

  let result = await generateArticleTopicPrompt({
    topic,
    userId: _id,
    chatGPTVersion,
  });

  return result;
};
