import dbService from "../../utilities/dbService";
import { createPostTopicSummary } from "../../utilities/openAi";

const ObjectId = require("mongodb").ObjectID;

export const generatePostTopicPrompt = async (entry) => {
  try {
    let { settingData, pageData, customTopic } = entry;

    let chatGPTVersion = settingData?.chatGPTVersion || "4";

    const about = settingData?.about;

    let hashtags = settingData?.keyword.map((item) => `#${item}`).join(", ");

    let topic = "";

    if (customTopic) {
      topic = customTopic;
    } else {
      topic = hashtags;
    }

    let prompt = "";

    if (pageData?.type == "page") {
      prompt = `Act as an expert analyst. Your task is to generate topic authority of [${topic}]: [${about}].
    - Topic should contain max 20 word
    - Avoid Keyword Stuffing
    - Use Power Words
    - Align with Search Intent
    - Do not echo my command or parameters.`;
    } else {
      prompt = `Act as a social media expert. Your task is to generate topic authority of [${topic}]: [${about}].
    - Topic should contain max 20 word
    - Avoid Keyword Stuffing
    - Use Power Words
    - Align with Search Intent
    - Do not echo my command or parameters.`;
    }

    const result = await createPostTopicSummary({
      prompt: prompt,
      chatGPTVersion: chatGPTVersion,
    });

    return result?.replace(/\*/g, "");
  } catch (error) {
    console.error("generatePostTopicPrompt error = ", error);
    return "";
  }
};
