import dbService from "../../utilities/dbService";
import { createNewsSummary } from "../../utilities/openAi";

import { checkCredit } from "../creditUsage/checkCredit";
import { updateCreditUsage } from "../creditUsage/updateCreditUsage";
import { CREDIT_TYPE } from "../../utilities/constants";

export const generateAdCreativeContent = async (entry) => {
  let {
    body: { topic, content },
    user: { _id, currentPageId, chatGPTVersion },
  } = entry;

  let prompt = `Act as an expert copywriter. Now, your task is to regenerate new content for ad creative existing content is ${content}. Content length must be same as original content.
    - Do not add HTML tags in comment.
    - Do not echo my command or parameters.`;

  const result = await createNewsSummary({
    prompt: prompt,
    chatGPTVersion: chatGPTVersion,
  });

  return result;
};
