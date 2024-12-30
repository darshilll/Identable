import dbService from "../../utilities/dbService";
import { SUBSCRIPTION_STATUS } from "../../utilities/constants";
import { createCommonPrompt } from "../../utilities/openAi";
import { createNewsSummary } from "../../utilities/openAi";

import { checkCredit } from "../creditUsage/checkCredit";
import { updateCreditUsage } from "../creditUsage/updateCreditUsage";
import { CREDIT_TYPE } from "../../utilities/constants";

const ObjectId = require("mongodb").ObjectID;

export const optimizeSEO = async (entry) => {
  let {
    body: { feedbackData, content, topic, headline, keywords },
    user: { _id, chatGPTVersion, currentPageId },
  } = entry;

  await checkCredit({
    userId: _id,
    pageId: currentPageId,
    creditType: CREDIT_TYPE.ARTICLE_SEO_OPTIMIZE,
  });

  const output = convertArrayToString(feedbackData?.feedbackArray);

  let feedback = "";

  for (let i = 0; i < feedbackData?.feedbackArray?.length; i++) {
    const element = feedbackData?.feedbackArray[i];

    for (let j = 0; j < element?.feedback.length; j++) {
      const feedbackObj = element?.feedback[j];
      feedback = `${feedback} ${feedbackObj}\n`;
    }
  }

  let prompt = `Regenerate article content based on this feedback: [${feedback}]. 
  Here is article details: 
  Article topic: [${topic}], 
  Article keywords: [${keywords}], 
  Article headline: [${headline}], 
  Article content: [${content}]`;

  prompt += `
  - Do not echo my command or parameters.
  `;
  console.log("prompt = ", prompt);
  let result = await createNewsSummary({
    prompt: prompt,
    chatGPTVersion: chatGPTVersion,
  });

  await updateCreditUsage({
    userId: _id,
    pageId: currentPageId,
    creditType: CREDIT_TYPE.ARTICLE_SEO_OPTIMIZE,
  });

  return result;
};

function convertArrayToString(arr) {
  let result = [];

  arr.forEach((item) => {
    for (let key in item) {
      if (Array.isArray(item[key])) {
        item[key].forEach((value) => {
          result.push(`${key}:${value}`);
        });
      } else {
        result.push(`${key}:${item[key]},`);
      }
    }
  });

  return result.join("\n");
}
