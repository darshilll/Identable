import dbService from "../../utilities/dbService";
import { SUBSCRIPTION_STATUS } from "../../utilities/constants";
import { createCommonPrompt } from "../../utilities/openAi";
import { generateArticlePrompt } from "../openai/generateArticlePrompt";

import { checkCredit } from "../creditUsage/checkCredit";
import { updateCreditUsage } from "../creditUsage/updateCreditUsage";
import { CREDIT_TYPE } from "../../utilities/constants";

const ObjectId = require("mongodb").ObjectID;

export const generateArticle = async (entry) => {
  let {
    body: { title, headingData, conclusion },
    user: { _id, chatGPTVersion, currentPageId },
  } = entry;

  await checkCredit({
    userId: _id,
    pageId: currentPageId,
    creditType: CREDIT_TYPE.ARTICLE,
  });

  let result = await generateArticlePrompt({
    title,
    headingData,
    userId: _id,
    chatGPTVersion,
    conclusion,
  });

  if (result) {
    await updateCreditUsage({
      userId: _id,
      pageId: currentPageId,
      creditType: CREDIT_TYPE.ARTICLE,
    });
  }

  return result;
};
