import dbService from "../../utilities/dbService";
import { generateAIImageAction } from "../aiimage/generateAIImageAction";
import { checkCredit } from "../creditUsage/checkCredit";
import { updateCreditUsage } from "../creditUsage/updateCreditUsage";
import { CREDIT_TYPE } from "../../utilities/constants";
import { createCommonPrompt } from "../../utilities/openAi";
import { generatePexelImage } from "../../utilities/generatePexelImage";
const ObjectId = require("mongodb").ObjectID;

export const generateCreative = async (entry) => {
  let {
    body: { topic, generatedImageType },
    user: { _id, chatGPTVersion, currentPageId },
  } = entry;

  const settingData = await dbService.findOneRecord("AIAdvanceSettingModel", {
    pageId: currentPageId,
  });

  if (!settingData) {
    return;
  }

  let tone = settingData?.tone || {};

  let aiToneArray = Object.keys(tone).filter(function (key) {
    return tone[key] === true;
  });

  let aiTone = aiToneArray.map((item) => `${item}`).join(", ");

  let prompt = `Act as a high-end copywriter. 
  Your task is to create a title, subtitle and description  about ${topic}. 
  Use HTML format, with bolded words where appropriate. 
  Ensure each card presents a clear and concise explanation of the topic, 
  with a unique focus for each. 
  The content should be engaging, intriguing, and written in ${settingData?.language} with 
  a sophisticated, ${aiTone} tone, while maintaining appropriate ${settingData?.formality}.
  
      
    - subTitle should contain minimum 6 to maximum 7 words
    - title should contain max 10 word
    - Do not echo my command or parameters.
    - Follow the below output pattern in the json format
    {
      "Data": {
      subTitle: [5 to 6 word subtitle is here',
      title: ['6 to 7 word Amazing Catchy Title Goes is Here!'],
      description: [10 word amazing description goes here.],
      }
    }`;
  let generatedImage = "";
  if (generatedImageType == "ai-image") {
    await checkCredit({
      userId: _id,
      pageId: currentPageId,
      creditType: CREDIT_TYPE.AI_IMAGE,
    });

    let newTopic = topic;

    if (!topic) {
      newTopic = settingData?.about;
    }

    let keywords = settingData?.keyword?.map((item) => `${item}`).join(", ");

    generatedImage = await generateAIImageAction({
      topic: newTopic,
      keywords: keywords,
      userId: _id,
      pageId: currentPageId,
    });

    if (!generatedImage) {
      throw new Error("Failed to generate image. Please try again.");
    }

    // ================ Update Credit ================

    await updateCreditUsage({
      userId: _id,
      pageId: currentPageId,
      creditType: CREDIT_TYPE.AI_IMAGE,
    });
  }

  if (generatedImageType == "pexel") {
    let pexelImageArray = await generatePexelImage({
      searchText: topic,
    });

    if (pexelImageArray?.length > 0) {
      generatedImage = pexelImageArray[0];
    }
  }

  const content = await createCommonPrompt({
    prompt: prompt,
    chatGPTVersion: settingData?.chatGPTVersion,
  });

  let contentData = content?.data?.length
    ? content?.data[0]?.data
    : content?.data;

  let result = {
    ...contentData,
  };

  if (generatedImageType) {
    result = {
      ...result,
      contentImage: generatedImage,
    };
  }

  return result;
};
