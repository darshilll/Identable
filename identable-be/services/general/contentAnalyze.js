import dbService from "../../utilities/dbService";
import { checkCredit } from "../creditUsage/checkCredit";
import { updateCreditUsage } from "../creditUsage/updateCreditUsage";
import { CREDIT_TYPE } from "../../utilities/constants";
import { genrateContentAnalyze } from "../../utilities/contentAnalyze";

export const contentAnalyze = async (entry) => {
  let {
    body: { content },
    user: { _id, currentPageId },
  } = entry;

  await checkCredit({
    userId: _id,
    pageId: currentPageId,
    creditType: CREDIT_TYPE.CONTENT_ANALYZE,
  });

  let response = await genrateContentAnalyze({ content });

  if (!response?.status) {
    throw new Error("Something went wrong");
  }

  // Convert the values to percentages
  let aiGenerated = response?.data?.ai * 100;
  let aiMix = response?.data?.mixed * 100;
  let humanWriten = response?.data?.human * 100;

  let analyzeData = {
    aiGenerated: aiGenerated,
    aiMix: aiMix,
    humanWriten: humanWriten,
  };

  let insertObj = {
    content: content,
    analyzeData: analyzeData,
    userId: _id,
    pageId: currentPageId,
    createdAt: Date.now(),
  };

  await dbService.createOneRecord("ContentAnalyzeModel", insertObj);

  // ================ Update Credit ================

  await updateCreditUsage({
    userId: _id,
    pageId: currentPageId,
    creditType: CREDIT_TYPE.CONTENT_ANALYZE,
  });

  return analyzeData;
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
