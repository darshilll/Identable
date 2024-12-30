import dbService from "../../utilities/dbService";
import {
  POST_GENERATE_TYPE,
  POST_STATUS,
  SUBSCRIPTION_STATUS,
  CREDIT_TYPE,
} from "../../utilities/constants";
const ObjectId = require("mongodb").ObjectID;

import { checkCredit } from "../creditUsage/checkCredit";
import { updateCreditUsage } from "../creditUsage/updateCreditUsage";

export const activeBoosting = async (entry) => {
  let {
    body: { postId, isBoosting, likeCount },
    user: { _id, currentPageId },
  } = entry;

  await checkCredit({
    userId: _id,
    pageId: currentPageId,
    creditType: CREDIT_TYPE.BOOSTING,
  });

  const postData = await dbService.findOneRecord(
    "PostModel",
    {
      _id: ObjectId(postId),
    },
    { _id: 1, isBoosting: 1 }
  );

  if (postData?.isBoosting) {
    throw new Error("Boosting already activated");
  }

  const subscriptionData = await dbService.findOneRecord(
    "SubscriptionModel",
    {
      userId: _id,
    },
    { _id: 1, subscriptionStatus: 1 }
  );

  if (
    subscriptionData?.subscriptionStatus == SUBSCRIPTION_STATUS.TRIAL &&
    likeCount > 10
  ) {
    throw new Error("Only 10 likes allowed in trial period");
  }

  let postObj = {
    isBoosting: true,
    likeCount: 10,
    updatedAt: Date.now(),
  };

  await dbService.updateOneRecords(
    "PostModel",
    { _id: ObjectId(postId) },
    postObj
  );

  await updateCreditUsage({
    userId: _id,
    pageId: currentPageId,
    creditType: CREDIT_TYPE.BOOSTING,
  });
  return "Post saved successfully";
};
