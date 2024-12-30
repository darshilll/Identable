import dbService from "../../utilities/dbService";
import { createCommonPrompt } from "../../utilities/openAi";

import { checkCredit } from "../creditUsage/checkCredit";
import { updateCreditUsage } from "../creditUsage/updateCreditUsage";
import { CREDIT_TYPE } from "../../utilities/constants";

export const carouselGenerate = async (entry) => {
  let {
    body: { slideLength, topic, themeContentType },
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

  let tone = settingData?.tone || {};
  let aiToneArray = Object.keys(tone).filter((key) => tone[key] === true);
  let aiTone = aiToneArray.map((item) => `${item}`).join(", ");

  const prompt = `Act as a high-end copywriter. Your task is to create a ${slideLength}-slide carousel-style list of cards about "${topic}" using the "${themeContentType}" theme. Use HTML format, with bolded words where appropriate. Ensure each card presents a clear and concise explanation of the topic, with a unique focus for each slide. The content should be engaging, intriguing, and written in ${
    settingData?.language
  } with a sophisticated, ${aiTone} tone, while maintaining appropriate ${
    settingData?.formality
  }.
  
  - Theme Guidance: 
    - **${themeContentType}**: ${
    themeContentType === "General"
      ? "Provide an overview or broad insights about the topic."
      : themeContentType === "Pain Points"
      ? "Highlight specific challenges or pain points related to the topic."
      : themeContentType === "Common Mistakes"
      ? "Discuss frequent mistakes people make around the topic."
      : themeContentType === "Misconceptions"
      ? "Address myths or misconceptions about the topic."
      : themeContentType === "eBook"
      ? "Structure the content like an eBook teaser, offering valuable insights to entice readers."
      : ""
  }

  - The main title should contain a minimum of 6 to a maximum of 7 words.
  - Slide titles should contain a maximum of 10 words.
  - Slide descriptions should contain a maximum of 100 words.
  - Each slide must have a unique focus but remain consistent with the "${themeContentType}" theme.
  - The last slide should be a footer slide containing only 5-6 words.
  - Do not echo my command or parameters.
  - Follow the below output pattern in JSON format:
  {
    "Data": [
      {
        "main": "",
        "mainSubTitle": ""
      },
      {
        "heading": "",
        "description": ""
      },
      {
        "footer": ""
      }
    ]
  }`;

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
