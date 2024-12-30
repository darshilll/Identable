import dbService from "../../utilities/dbService";
import { generateAIImageAction } from "./generateAIImageAction";
import { checkCredit } from "../creditUsage/checkCredit";
import { updateCreditUsage } from "../creditUsage/updateCreditUsage";
import { CREDIT_TYPE } from "../../utilities/constants";

export const generateAIImage = async (entry) => {
  let {
    body: { topic, size },
    user: { _id, currentPageId },
  } = entry;

  await checkCredit({
    userId: _id,
    pageId: currentPageId,
    creditType: CREDIT_TYPE.AI_IMAGE,
  });

  let newTopic = topic;

  const settingData = await dbService.findOneRecord("AIAdvanceSettingModel", {
    pageId: currentPageId,
  });

  if (!topic) {
    newTopic = settingData?.about;
  }

  let keywords = settingData?.keyword?.map((item) => `${item}`).join(", ");

  let image = await generateAIImageAction({
    topic: newTopic,
    keywords: keywords,
    userId: _id,
    pageId: currentPageId,
    size: size,
  });

  if (!image) {
    throw new Error("Failed to generate image. Please try again.");
  }

  // ================ Update Credit ================

  await updateCreditUsage({
    userId: _id,
    pageId: currentPageId,
    creditType: CREDIT_TYPE.AI_IMAGE,
  });

  return image;
};
