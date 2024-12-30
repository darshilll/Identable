import dbService from "../../utilities/dbService";
import { checkCredit } from "../creditUsage/checkCredit";
import { updateCreditUsage } from "../creditUsage/updateCreditUsage";
import { CREDIT_TYPE } from "../../utilities/constants";
import { genrateHumanizerContent } from "../../utilities/contentAnalyze";

export const contentHumanize = async (entry) => {
  let {
    body: { content },
    user: { _id, currentPageId },
  } = entry;

  await checkCredit({
    userId: _id,
    pageId: currentPageId,
    creditType: CREDIT_TYPE.CONTENT_HUMANIZE,
  });

  let response = await genrateHumanizerContent({ content });

  if (!response?.status) {
    throw new Error("Something went wrong");
  }

  let insertObj = {
    content: content,
    humanizeContent: response?.data?.humanizedText,
    userId: _id,
    pageId: currentPageId,
    createdAt: Date.now(),
  };

  await dbService.createOneRecord("ContentHumanizeModel", insertObj);

  // ================ Update Credit ================

  await updateCreditUsage({
    userId: _id,
    pageId: currentPageId,
    creditType: CREDIT_TYPE.CONTENT_HUMANIZE,
  });

  return response.data?.humanizedText;
};
