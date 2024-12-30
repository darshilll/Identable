import dbService from "../../utilities/dbService";
import { generateAIImageAction } from "../aiimage/generateAIImageAction";
import { checkCredit } from "../creditUsage/checkCredit";
import { updateCreditUsage } from "../creditUsage/updateCreditUsage";
import { CREDIT_TYPE } from "../../utilities/constants";

export const generateBannerImage = async (entry) => {
  let {
    body: { goal, topic, keywords, headline },
    user: { _id, currentPageId },
  } = entry;

  await checkCredit({
    userId: _id,
    pageId: currentPageId,
    creditType: CREDIT_TYPE.AI_IMAGE,
  });

  let prompt = `Create a article banner image based on these article goal: ${goal}, article topic: ${topic}, article keywords: ${keywords}, article headline: ${headline}. - Do not add text on image.`;

  let image = await generateAIImageAction({
    userId: _id,
    pageId: currentPageId,
    size: "1024x1024",
    promptVal: prompt,
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
