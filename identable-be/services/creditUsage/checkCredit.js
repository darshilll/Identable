import dbService from "../../utilities/dbService";
import { CREDIT_TYPE } from "../../utilities/constants";

const ObjectId = require("mongodb").ObjectID;

export const checkCredit = async (entry) => {
  let { userId, pageId, creditType } = entry;

  let credit = 0;

  const subscriptionData = await dbService.findOneRecord(
    "SubscriptionModel",
    {
      userId: userId,
    },
    { _id: 1, credit: 1, additionalCredit: 1, isAIVideo: 1, planId: 1 }
  );

  const planData = await dbService.findOneRecord("PlanModel", {
    _id: subscriptionData?.planId,
  });

  if (creditType == CREDIT_TYPE.AI_IMAGE) {
    credit = planData?.aiImageCredit;
  } else if (creditType == CREDIT_TYPE.AI_VIDEO) {
    if (!subscriptionData?.isAIVideo) {
      throw new Error("Permission denied");
    }
    credit = planData?.aIVideoCredit;
  } else if (creditType == CREDIT_TYPE.CAROUSEL) {
    credit = planData?.carouselCredit;
  } else if (creditType == CREDIT_TYPE.ADVANCE_SCHEDULE) {
    credit = planData?.advancedScheduleCredit;
  } else if (creditType == CREDIT_TYPE.BOOSTING) {
    credit = planData?.boostingCredit;
  } else if (creditType == CREDIT_TYPE.DISCOVER_EMAIL) {
    credit = planData?.discoverEmailCredit;
  } else if (creditType == CREDIT_TYPE.ARTICLE) {
    credit = planData?.articleCredit;
  } else if (creditType == CREDIT_TYPE.TRENDING_NEWS_SEARCH) {
    credit = planData?.searchNewsCredit;
  } else if (creditType == CREDIT_TYPE.CONTENT_ANALYZE) {
    credit = planData?.contentAnalyzeCredit;
  } else if (creditType == CREDIT_TYPE.CONTENT_HUMANIZE) {
    credit = planData?.contentHumanizeCredit;
  }

  if (
    subscriptionData?.credit >= credit ||
    subscriptionData?.additionalCredit >= credit
  ) {
    return true;
  }
  throw new Error("Credit not available");
};
