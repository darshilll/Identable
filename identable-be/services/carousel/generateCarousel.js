import dbService from "../../utilities/dbService";
import { createCommonPrompt } from "../../utilities/openAi";

import { checkCredit } from "../creditUsage/checkCredit";
import { updateCreditUsage } from "../creditUsage/updateCreditUsage";
import { CREDIT_TYPE } from "../../utilities/constants";

export const generateCarousel = async (entry) => {
  let {
    body: { postId, length, topic, promtTheme },
    user: { _id, currentPageId },
  } = entry;

  await checkCredit({
    userId: _id,
    pageId: currentPageId,
    creditType: CREDIT_TYPE.CAROUSEL,
  });

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

  if (promtTheme == "eBook") {
    prompt = `Act as a professional book writer and editor with 30 years of experience. Your task is to follow the 1- 3 steps listed below.
    Step 1- Generate a title for a book about "${topic}".
    Step 2- Great. Generate ${length} book chapters and list them.
    Step 3- Generate each Chapter from 1 - ${length} with detailed information.
      
    - main should contain minimum 6 to maximum 7 words
    - title should contain max 10 word
    - content should contain max 100 words
    - Do not echo my command or parameters.
    - Follow the below output pattern in the json format
    {
      "Data": [
        {
          "main": ""
        },
        {
          "title": "",
          "content": ""
        }
      ]
    }`;
  } else {
    //   prompt = `Act as a high-end copywriter. Your task is to create ${length} a carousel-style list of common ${promtTheme} about ${topic}. Use markdown formatting, bolded words, lists and tables and FAQ's where possible in your list, showing accuracy. Your response should not repeat or restate the original prompt or its parameters.

    // The carousel-style list should consist of separate and distinct cards, each presenting a different ${promtTheme}. The content of each card should be clear and concise, providing a brief explanation or debunking of the ${promtTheme}. Additionally, your list should utilize ${settingData?.language} language and ${aiTone} tone appropriate for a high-end copywriter, engaging and intriguing the reader while maintaining a ${settingData?.formality} and sophisticated voice, and incorporating emojis tactfully.

    // Provide the output of the posts in the json format

    // Data: [
    //    {
    //      title: "Your hookup content here",
    //      content: "Your carousel content here"
    // }
    // ]`;

    prompt = `Act as a high-end copywriter. Your task is to create ${length} a carousel-style list of ${promtTheme} about ${topic}. Use HTML format, bolded words where possible. Your response should not repeat or restate the original prompt or its parameters.
  The carousel-style list should consist of a main card and separate and distinct cards, each presenting a different ${promtTheme}. The content of each card should be clear and concise, providing a brief explanation of the ${promtTheme}. Additionally, your list should utilize the ${settingData?.language} language and ${aiTone} tone appropriate for a high-end copywriter, engaging and intriguing the reader while maintaining a ${settingData?.formality} and sophisticated voice, and incorporating emojis tactfully.
  
  - main should contain minimum 6 to maximum 7 words
  - title should contain max 10 word
  - content should contain max 100 words
  - Do not echo my command or parameters.
  - Follow the below output pattern in the json format
  {
    "Data": [
      {
        "main": ""
      },
      {
        "title": "",
        "content": ""
      }
    ]
  }`;
  } 

  const result = await createCommonPrompt({
    prompt: prompt,
    chatGPTVersion: settingData?.chatGPTVersion,
  });

  if (result) {
    await updateCreditUsage({
      userId: _id,
      pageId: currentPageId,
      creditType: CREDIT_TYPE.CAROUSEL,
    });
  }

  return result?.data ? result?.data : result;
};
