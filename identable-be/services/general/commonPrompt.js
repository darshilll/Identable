import dbService from "../../utilities/dbService";
import { SUBSCRIPTION_STATUS } from "../../utilities/constants";
import { createCommonPrompt } from "../../utilities/openAi";
import { generateCommonPrompt } from "../openai/generateCommonPrompt";

const ObjectId = require("mongodb").ObjectID;

export const commonPrompt = async (entry) => {
  let {
    body: {
      promptAction,
      designation,
      keyword,
      youAre,
      about,
      pageId,
      pointOfView,
      campaignTopic,
      carouselTopic,
    },
    user: { _id, chatGPTVersion, currentPageId },
  } = entry;

  let result = await generateCommonPrompt({
    promptAction,
    designation,
    keyword,
    youAre,
    userId: _id,
    chatGPTVersion,
    currentPageId,
    about,
    pageId,
    pointOfView,
    campaignTopic,
    carouselTopic,
  });

  return result;
};
