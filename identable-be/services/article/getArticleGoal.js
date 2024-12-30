import dbService from "../../utilities/dbService";
import { createCommonPrompt } from "../../utilities/openAi";

const ObjectId = require("mongodb").ObjectID;

export const getArticleGoal = async (entry) => {
  let {
    body: {},
    user: { _id, currentPageId },
  } = entry;

  // const settingData = await dbService.findOneRecord(
  //   "AIAdvanceSettingModel",
  //   {
  //     pageId: currentPageId,
  //   },
  //   {
  //     keyword: 1,
  //     about: 1,
  //     pointOfView: 1,
  //     targetAudience: 1,
  //     objective: 1,
  //     callOfAction: 1,
  //     chatGPTVersion: 1,
  //   }
  // );

  // let chatGPTVersion = settingData?.chatGPTVersion || "4";
  // let targetAudience = settingData?.targetAudience || [];
  // targetAudience = targetAudience?.join(" OR ");
  // let objective = settingData?.objective || "";
  // let callOfAction = settingData?.callOfAction || "";
  // let pointOfView = settingData?.pointOfView || "";
  // let about = settingData?.about || "";

  // let prompt = `Act as an SEO expert. Generate five article goal using these about us [${about}] as the Point of View being [${pointOfView}], The target audience is [${targetAudience}], and the post is intended to [${objective}]. The call to action is to [${callOfAction}]. Your response should not repeat or restate the original prompt or its parameters.

  // - goal should contain max 6 word
  // - Do not repeat goal
  // - Do not echo my command or parameters.
  // - Follow the below output pattern in the json format
  // {
  //   "Data": [
  //     {
  //       "goal": "Goal Here"
  //     }
  //   ]
  // }`;

  // const result = await createCommonPrompt({
  //   prompt: prompt,
  //   chatGPTVersion: chatGPTVersion,
  // });

  let result = [
    "SEO ranking",
    "Audience engagement",
    "Thought leadership",
    "Product promotion",
    "Service promotion",
  ];

  return result;
};
