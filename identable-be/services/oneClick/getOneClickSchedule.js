const moment = require("moment-timezone");
import dbService from "../../utilities/dbService";
import { POST_GENERATE_TYPE, POST_STATUS } from "../../utilities/constants";
import { getOneClickScheduleData } from "./getOneClickScheduleData";
import { generateCommonPrompt } from "../openai/generateCommonPrompt";
const ObjectId = require("mongodb").ObjectID;

export const getOneClickSchedule = async (entry) => {
  let {
    body: { topic, dailyPost, isWeekendInclude, duration, includeContentType },
    user: { _id, userTimezone, currentPageId, chatGPTVersion },
  } = entry;

  const subscriptionData = await dbService.findOneRecord(
    "SubscriptionModel",
    {
      userId: _id,
    },
    { _id: 1, credit: 1, isAIVideo: 1, planId: 1 }
  );

  if (subscriptionData?.credit <= 0) {
    throw new Error("Credit not available");
  }

  const planData = await dbService.findOneRecord("PlanModel", {
    _id: subscriptionData?.planId,
  });

  if (
    !subscriptionData?.isAIVideo &&
    includeContentType?.includes(POST_GENERATE_TYPE.AI_VIDEO)
  ) {
    throw new Error("You have no AI Video Permission");
  }

  let durationData = await getOneClickScheduleData(entry);

  let scheduleData = [];

  let creditCounter = 0;

  let counter = 0;

  for (let i = 0; i < durationData?.length; i++) {
    const durationDic = durationData[i];
    if (counter >= includeContentType?.length) {
      counter = 0;
    }

    let generatedType = includeContentType[counter];
    
    if (includeContentType[counter] == POST_GENERATE_TYPE.CAROUSEL) {
      creditCounter = creditCounter + planData?.carouselCredit;
    } else if (includeContentType[counter] == POST_GENERATE_TYPE.AI_VIDEO) {
      creditCounter = creditCounter + planData?.aIVideoCredit;
    } else if (includeContentType[counter] == POST_GENERATE_TYPE.ARTICLE) {
      creditCounter = creditCounter + planData?.articleCredit;
    }
    counter += 1;

    if (creditCounter >= subscriptionData?.credit) {
      break;
    }

    creditCounter = creditCounter + planData?.advancedScheduleCredit;

    scheduleData.push({
      ...durationDic,
      generatedType: generatedType,
    });
  }

  if (scheduleData?.length == 0) {
    throw new Error("Credit not available.");
  }
  let result = await generateCommonPrompt({
    promptAction: "oneClickSubTopic",
    userId: _id,
    chatGPTVersion,
    currentPageId,
    campaignTopic: topic,
    count: scheduleData?.length,
  });

  if (!result?.data || result?.data?.length == 0) {
    result = await generateCommonPrompt({
      promptAction: "oneClickSubTopic",
      userId: _id,
      chatGPTVersion,
      currentPageId,
      campaignTopic: topic,
    });
  }
  if (!result?.data || result?.data?.length == 0) {
    throw new Error("Something went wrong. Please try again.");
  }

  let newScheduleData = [];
  let subTopicArray = result?.data;
  for (let i = 0; i < scheduleData?.length; i++) {
    const scheduleDic = scheduleData[i];

    let subTopic = topic;

    if (subTopicArray?.length > i) {
      subTopic = subTopicArray[i]?.data || topic;
    }

    newScheduleData.push({
      ...scheduleDic,
      _id: i,
      subTopic: subTopic,
    });
  }

  let message =
    "Your post will be scheduled based on the following time period.";
  return {
    scheduleData: newScheduleData,
    message: message,
    creditDeducated: creditCounter,
  };
};
