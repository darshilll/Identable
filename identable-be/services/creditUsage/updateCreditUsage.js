import dbService from "../../utilities/dbService";
import { CREDIT_TYPE } from "../../utilities/constants";

const ObjectId = require("mongodb").ObjectID;

export const updateCreditUsage = async (entry) => {
  let {
    userId,
    pageId,
    creditType,
    manualCredit,
    discoverEmailLinkedinUserName,
  } = entry;

  let credit = 0;

  const subscriptionData = await dbService.findOneRecord(
    "SubscriptionModel",
    {
      userId: userId,
    },
    { _id: 1, credit: 1, additionalCredit: 1, planId: 1 }
  );

  const planData = await dbService.findOneRecord("PlanModel", {
    _id: subscriptionData?.planId,
  });

  if (creditType == CREDIT_TYPE.AI_IMAGE) {
    credit = planData?.aiImageCredit;
  } else if (creditType == CREDIT_TYPE.AI_VIDEO) {
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
  } else if (creditType == CREDIT_TYPE.ONE_CLICK) {
    credit = manualCredit;
  } else if (creditType == CREDIT_TYPE.BOOSTING_CAMPAIGN) {
    credit = manualCredit;
  }

  if (subscriptionData?.credit >= credit) {
    await dbService.updateOneRecords(
      "SubscriptionModel",
      { _id: subscriptionData?._id },
      {
        credit: subscriptionData?.credit - credit,
      }
    );
  } else if (subscriptionData?.credit > 0) {
    let additionalCreditDeduct = credit - subscriptionData?.credit;

    await dbService.updateOneRecords(
      "SubscriptionModel",
      { _id: subscriptionData?._id },
      {
        credit: 0,
        additionalCredit:
          subscriptionData?.additionalCredit - additionalCreditDeduct,
      }
    );
  } else {
    await dbService.updateOneRecords(
      "SubscriptionModel",
      { _id: subscriptionData?._id },
      {
        credit: 0,
        additionalCredit: subscriptionData?.additionalCredit - credit,
      }
    );
  }

  let creditObj = {
    userId: userId,
    pageId: pageId,
    creditType: creditType,
    credit: credit,
    createdAt: Date.now(),
  };

  if (discoverEmailLinkedinUserName) {
    creditObj = {
      ...creditObj,
      discoverEmailLinkedinUserName: discoverEmailLinkedinUserName,
    };
  }

  await dbService.createOneRecord("CreditUsageModel", creditObj);

  return "Saved Successfully";
};
