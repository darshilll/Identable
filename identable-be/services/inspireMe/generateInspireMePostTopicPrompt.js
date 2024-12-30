import dbService from "../../utilities/dbService";
import { createPostTopicSummary } from "../../utilities/openAi";
import { INSPIREME_TYPE } from "../../utilities/constants";

const ObjectId = require("mongodb").ObjectID;

export const generateInspireMePostTopicPrompt = async (entry) => {
  try {
    let { settingData, pageData, inspireMeType } = entry;

    let chatGPTVersion = settingData?.chatGPTVersion || "4";

    const about = settingData?.about;
    let designation = pageData?.designation || "";

    let hashtags = settingData?.keyword.map((item) => `#${item}`).join(", ");

    let topic = hashtags;

    let prompt = "";

    if (pageData?.type == "page") {
      prompt = `Act as an expert analyst. Your task is to generate topic authority of [${topic}]: [${about}].
    - Topic should contain max 20 word
    - Avoid Keyword Stuffing
    - Use Power Words
    - Align with Search Intent
    - Do not echo my command or parameters.`;
    } else {
      if (inspireMeType == INSPIREME_TYPE.Industry_Trend) {
        prompt = `Generate a topic about a current trend in [${designation}]. The topic should be forward-looking and thought-provoking.`;
      } else if (inspireMeType == INSPIREME_TYPE.ThoughtLeadership) {
        prompt = `Create a topic thought-provoking statement about the future of [${designation}] that challenges conventional wisdom. The statement should be bold but not controversial`;
      } else if (inspireMeType == INSPIREME_TYPE.ProductivityHacks) {
        prompt = `Generate a unique productivity hack topic for professionals in [${designation}] that can save significant time or improve efficiency. The hack should be specific, actionable, and not widely known.`;
      } else if (inspireMeType == INSPIREME_TYPE.ProfessionalTips) {
        prompt = `Provide one actionable professional topic for [${designation}] professionals that can significantly impact their career growth or skill set. Use clear, directive language.`;
      } else if (inspireMeType == INSPIREME_TYPE.IndustryPrediction) {
        prompt = `Create a short-term (6-12 month) prediction topic for [${designation}] based on current trends or recent developments. The prediction should be thought-provoking and encourage discussion.`;
      }

      prompt = `${prompt}
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
