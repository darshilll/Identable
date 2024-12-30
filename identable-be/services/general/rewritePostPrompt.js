import dbService from "../../utilities/dbService";
import { generateRewritePostPrompt } from "../openai/generateRewritePostPrompt";

export const rewritePostPrompt = async (entry) => {
  let {
    body: { postContent },
    user: { _id, chatGPTVersion, currentPageId },
  } = entry;

  const settingData = await dbService.findOneRecord(
    "AIAdvanceSettingModel",
    {
      pageId: currentPageId,
    },
    {
      formality: 1,
    }
  );

  if (!settingData) {
    throw new Error("AI Settings not found");
  }

  let result = await generateRewritePostPrompt({
    postContent,
    formality: settingData.formality,
    chatGPTVersion,
  });

  return result;
};
