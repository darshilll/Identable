import dbService from "../../utilities/dbService";
import { createCommonPrompt } from "../../utilities/openAi";

import { checkCredit } from "../creditUsage/checkCredit";
import { updateCreditUsage } from "../creditUsage/updateCreditUsage";
import { CREDIT_TYPE } from "../../utilities/constants";

export const generateCarouselSlide = async (entry) => {
  let {
    body: { topic, slideType },
    user: { _id, currentPageId },
  } = entry;

  const settingData = await dbService.findOneRecord(
    "AIAdvanceSettingModel",
    {
      pageId: currentPageId,
    },
    {
      formality: 1,
      tone: 1,
      language: 1,
      chatGPTVersion: 1,
    }
  );

  if (!settingData) {
    return;
  }

  let prompt;

  let tone = settingData?.tone || {};

  let aiToneArray = Object.keys(tone).filter(function (key) {
    return tone[key] === true;
  });

  let aiTone = aiToneArray.map((item) => `${item}`).join(", ");

  if (slideType == "starting_slide") {
    prompt = `Act as a high-end copywriter. Your task is to create a one slide of carousel based on this topic [${topic}]. Use HTML format, with bolded words where appropriate. Ensure content presents a clear and concise explanation of the topic, with a unique focus for each. The content should be engaging, intriguing, and written in ${settingData?.language} with a sophisticated, ${aiTone} tone, while maintaining appropriate ${settingData?.formality}. Your response should not repeat or restate the original prompt or its parameters.
  
    - main should  minimum 6 to maximum 7 words
    - title should contain max 10 word
    - Do not echo my command or parameters.
    - Follow the below output pattern in the json format
    {
      "Data": [
        {
          "main": ""
          "mainSubTitle": ""
        },
      ]
    }`;
  } else if (slideType == "body_slide") {
    prompt = `Act as a high-end copywriter. Your task is to create a one slide of carousel based on this topic [${topic}]. Use HTML format, with bolded words where appropriate. Ensure content presents a clear and concise explanation of the topic, with a unique focus for each. The content should be engaging, intriguing, and written in ${settingData?.language} with a sophisticated, ${aiTone} tone, while maintaining appropriate ${settingData?.formality}. Your response should not repeat or restate the original prompt or its parameters.
  
  - heading should contain max 10 word
  - description should contain max 100 words
  - Do not echo my command or parameters.
  - Follow the below output pattern in the json format
  {
    "Data": [
      {
        "heading": "",
        "description": ""
      },
    ]
  }`;
  } else if (slideType == "ending_slide") {
    prompt = `Act as a high-end copywriter. Your task is to create a one slide of carousel based on this topic [${topic}]. Use HTML format, with bolded words where appropriate. Ensure content presents a clear and concise explanation of the topic, with a unique focus for each. The content should be engaging, intriguing, and written in ${settingData?.language} with a sophisticated, ${aiTone} tone, while maintaining appropriate ${settingData?.formality}. Your response should not repeat or restate the original prompt or its parameters.
  
    - write slide as a footer slide with only 5-6 words contain for call to action
    - Do not repeat content.
    - Do not echo my command or parameters.
    - Follow the below output pattern in the json format
    {
      "Data": [
        {
          "footer": ""
        }
      ]
    }`;
  }

  const result = await createCommonPrompt({
    prompt: prompt,
    chatGPTVersion: settingData?.chatGPTVersion,
  });

  return result?.data ? result?.data : result;
};
