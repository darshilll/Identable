import dbService from "../../utilities/dbService";
import {
  RECURRING_TYPE,
  SUBSCRIPTION_STATUS,
  PLAN,
} from "../../utilities/constants";

const env = process.env.NODE_ENV ? process.env.NODE_ENV : "dev";
var stripeKey = process.env.STRIPE;
var stripe = require("stripe")(stripeKey);

const ObjectId = require("mongodb").ObjectID;

export const cancelSubscription = async (entry) => {
  let {
    user: { _id },
  } = entry;

  const subscriptionData = await dbService.findOneRecord(
    "SubscriptionModel",
    {
      userId: ObjectId(_id),
    },
    { stripeSubscriptionId: 1 }
  );

  if (!subscriptionData) {
    throw new Error("subscription not found");
  }

  if (!subscriptionData?.stripeSubscriptionId) {
    throw new Error("subscription not found");
  }

  const subscription = await stripe.subscriptions.update(
    subscriptionData?.stripeSubscriptionId,
    {
      cancel_at_period_end: true,
    }
  );

  // const subscription = await stripe.subscriptions.cancel(
  //   subscriptionData?.stripeSubscriptionId
  // );

  // if (subscription?.status == "canceled") {
  // }

  return "Subscription cancelled successfully";
};
