import dbService from "../../utilities/dbService";
import { SUBSCRIPTION_STATUS } from "../../utilities/constants";
import { createCommonPrompt } from "../../utilities/openAi";

const ObjectId = require("mongodb").ObjectID;

export const generateKeywordPrompt = async (entry) => {
  let { chatGPTVersion, keyword } = entry;

  let prompt = `Correct the spelling for the listed items: ${keyword}
  - Do not echo my command or parameters.
  - Provide the corrected spellings in the following JSON format: "[ { "data": "" } ]"
  `;

  const result = await createCommonPrompt({
    prompt: prompt,
    chatGPTVersion: chatGPTVersion,
  });

  return result;
};
