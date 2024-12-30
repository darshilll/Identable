import dbService from "../../utilities/dbService";
import { SUBSCRIPTION_STATUS } from "../../utilities/constants";
import { createCommonPrompt } from "../../utilities/openAi";
import { generateArticleTopicPrompt } from "../openai/generateArticlePrompt";

const ObjectId = require("mongodb").ObjectID;

export const getArticleKeywords = async (entry) => {
  let {
    body: { topic },
    user: { _id, currentPageId, chatGPTVersion },
  } = entry;

  let prompt = `Act as an SEO expert. Generate five article keywords using these aritcle topic [${topic}]. Your response should not repeat or restate the original prompt or its parameters.

  - keyword should contain max 1 or 2 word
  - Do not repeat keyword
  - Do not echo my command or parameters.
  - Follow the below output pattern in the json format
  {
    "Data": [
      {
        "keyword": "keyword Here"
      }
    ]
  }`;

  const result = await createCommonPrompt({
    prompt: prompt,
    chatGPTVersion: chatGPTVersion,
  });

  return result;
};
