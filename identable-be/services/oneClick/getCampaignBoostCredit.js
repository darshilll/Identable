const moment = require("moment-timezone");
import dbService from "../../utilities/dbService";

const ObjectId = require("mongodb").ObjectID;

export const getCampaignBoostCredit = async (entry) => {
  let {
    body: { campaignId },
    user: { _id, userTimezone, currentPageId },
  } = entry;

  const subscriptionData = await dbService.findOneRecord(
    "SubscriptionModel",
    {
      userId: _id,
    },
    {
      _id: 1,
      credit: 1,
      planId: 1,
    }
  );

  if (subscriptionData?.credit <= 0) {
    throw new Error("Credit not available");
  }

  const planData = await dbService.findOneRecord("PlanModel", {
    _id: subscriptionData?.planId,
  });

  const postCount = await dbService.recordsCount("PostModel", {
    userId: _id,
    oneClickId: ObjectId(campaignId),
    isBoosting: false,
  });

  if (postCount == 0) {
    throw new Error("Post not available for boosting.");
  }

  let creditDeducated = postCount * planData?.boostingCredit;

  return { credit: creditDeducated };
};
