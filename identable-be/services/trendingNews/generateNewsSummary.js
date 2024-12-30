import dbService from "../../utilities/dbService";
import { getNews } from "../../utilities/news";

const ObjectId = require("mongodb").ObjectID;
import { generateNewsSummaryPrompt } from "../openai/generateNewsSummaryPrompt";

export const generateNewsSummary = async (entry) => {
  let {
    body: { title, content, url },
    user: { _id, chatGPTVersion, currentPageId },
  } = entry;

  const settingData = await dbService.findOneRecord(
    "AIAdvanceSettingModel",
    {
      pageId: currentPageId,
    },
    {
      language: 1,
      tone: 1,
      formality: 1,
    }
  );

  let aiToneArray = Object.keys(settingData?.tone).filter(function (key) {
    return settingData?.tone[key] === true;
  });

  let aiTone = aiToneArray.map((item) => `${item}`).join(", ");

  let formality = settingData?.formality || "";


  let result = await generateNewsSummaryPrompt({
    title,
    content,
    url,
    chatGPTVersion,
    language: settingData?.language,
    tone: aiTone,
    formality: formality, 
  });
  return result;
};
