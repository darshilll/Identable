import dbService from "../../utilities/dbService";
import { SUBSCRIPTION_STATUS } from "../../utilities/constants";
import { createCommonPrompt } from "../../utilities/openAi";
import { generateArticleTopicPrompt } from "../openai/generateArticlePrompt";

const ObjectId = require("mongodb").ObjectID;

export const getAIImageIdea = async (entry) => {
  let {
    body: {},
    user: { _id, currentPageId },
  } = entry;

  const settingData = await dbService.findOneRecord(
    "AIAdvanceSettingModel",
    {
      pageId: currentPageId,
    },
    {
      keyword: 1,
      about: 1,
      pointOfView: 1,
      targetAudience: 1,
      objective: 1,
      callOfAction: 1,
      chatGPTVersion: 1,
    }
  );

  let chatGPTVersion = settingData?.chatGPTVersion || "4";
  let targetAudience = settingData?.targetAudience || [];
  targetAudience = targetAudience?.join(" OR ");
  let objective = settingData?.objective || "";
  let callOfAction = settingData?.callOfAction || "";
  let pointOfView = settingData?.pointOfView || "";
  let about = settingData?.about || "";

  let prompt = `Act as an SEO expert. Generate five AI Image prompt as the Point of View being [${pointOfView}], The target audience is [${targetAudience}], and the image is intended to [${objective}]. The call to action is to [${callOfAction}]. Your response should not repeat or restate the original prompt or its parameters.

  - Do not repeat idea
  - Do not echo my command or parameters.
  - Follow the below output pattern in the json format
  {
    "Data": [
      {
        "prompt": "prompt Here"
      }
    ]
  }`;

  const result = await createCommonPrompt({
    prompt: prompt,
    chatGPTVersion: chatGPTVersion,
  });

  return result;
};
