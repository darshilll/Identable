import dbService from "../../utilities/dbService";
import { SUBSCRIPTION_STATUS } from "../../utilities/constants";
import { createNewsSummary } from "../../utilities/openAi";

const ObjectId = require("mongodb").ObjectID;

export const generateNewsSummaryPrompt = async (entry) => {
  let { chatGPTVersion, title, content, url, language, tone, formality } =
    entry;

  // let prompt =
  //   `using lists and tables. I want you to only answer in English. Analyze the web page content and prepare a web page summary report which has a key takeaway and a summary in bullet points, include web page URL.

  //   [REPORT FORMAT]:
  //   - Key Takeaway
  //   A single most important takeaway from the text in English

  //   - Summary
  //   Summarize the web page here in bullet-points. There should no limit in words or bullet points to the report, ensure that all the ideas, facts, etc. are concisely reported out. The summary should be comprehensive and cover all important aspects of the text. Do not use any emoji.
  //   - Do not echo my command or parameters enclosed in [].
  //   [WEB PAGE TITLE]: ` +
  //   title +
  //   `

  //   [WEB PAGE CONTENT]: ` +
  //   content +
  //   `

  //   [WEB PAGE URL]: ` +
  //   url;

  let prompt = `Act as an expert news writer. Your task is to analyze the web page content and prepare a summary which has a key takeaway and a summary in bullet points, include web page URL. Summary should be written in [${language}]. The tone of your writing should be [${tone}], and the level of formality should be [${formality}] and provide an authentic and personal touch. 
    - Do not echo my command or parameters.
    [WEB PAGE TITLE]: ${title}
    [WEB PAGE CONTENT]: ${content}
    [WEB PAGE URL]: ${url}`;

  const result = await createNewsSummary({
    prompt: prompt,
    chatGPTVersion: chatGPTVersion,
  });

  return result;
};
