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

export const createCheckoutSession = async (entry) => {
  let {
    body: { planId, recurringType },
    user: { _id },
  } = entry;

  if (
    recurringType != RECURRING_TYPE.MONTHLY &&
    recurringType != RECURRING_TYPE.YEARLY
  ) {
    throw new Error("Invalid recurringType");
  }

  const subscriptionData = await dbService.findOneRecord(
    "SubscriptionModel",
    {
      userId: _id,
    },
    { recurringType: 1, subscriptionStatus: 1, planId: 1, stripeCustomerId: 1 }
  );

  if (!subscriptionData) {
    throw new Error("subscription not found");
  }

  // if (
  //   subscriptionData?.recurringType == RECURRING_TYPE.YEARLY &&
  //   recurringType == RECURRING_TYPE.MONTHLY
  // ) {
  //   throw new Error("You can not downgrade plan.");
  // }

  // if (subscriptionData?.subscriptionStatus == SUBSCRIPTION_STATUS.ACTIVE) {
  //   if (
  //     recurringType == subscriptionData?.recurringType &&
  //     subscriptionData?.planId?.toString() == planId
  //   ) {
  //     throw new Error("You already subscribed this plan");
  //   }

  //   if (
  //     recurringType == RECURRING_TYPE.YEARLY &&
  //     subscriptionData?.recurringType == RECURRING_TYPE.MONTHLY
  //   ) {
  //   } else if (
  //     planId == PLAN.TRY_IT_ON &&
  //     (subscriptionData?.planId == PLAN.YOUR_GROWING ||
  //       subscriptionData?.planId == PLAN.MASTER)
  //   ) {
  //     throw new Error("You can not downgrade plan at this time");
  //   } else if (
  //     planId == PLAN.YOUR_GROWING &&
  //     subscriptionData?.planId == PLAN.MASTER
  //   ) {
  //     throw new Error("You can not downgrade plan at this time");
  //   }
  // }

  const planData = await dbService.findOneRecord(
    "PlanModel",
    {
      _id: ObjectId(planId),
    },
    { _id: 1, monthlyPriceId: 1, yearlyPriceId: 1 }
  );

  if (!planData) {
    throw new Error("Plan not found");
  }

  const userData = await dbService.findOneRecord(
    "UserModel",
    {
      _id: _id,
      isDeleted: false,
    },
    { _id: 1, email: 1 }
  );

  // const configurations = await stripe.billingPortal.configurations.list({
  //   limit: 3,
  // });

  // return;
  let configurationKey =
    env == "local"
      ? "bpc_1P50OoSHUMHVbxMlhDCCahdL"
      : "bpc_1P6yE2SHUMHVbxMl1IpnmjBt";

  if (subscriptionData?.stripeCustomerId) {
    const session = await stripe.billingPortal.sessions.create({
      customer: subscriptionData?.stripeCustomerId,
      configuration: configurationKey,
      return_url: `${process.env.LIVE_URL}/subscription/plan`,
    });

    return session?.url;
  } else {
    let metadata = {
      planId: planData?._id?.toString(),
      userId: userData?._id?.toString(),
      recurringType: recurringType,
    };

    let priceId = "price_1PkpAeSHUMHVbxMl2QFqznoZ";
    if (env == "production") {
      priceId =
        recurringType == RECURRING_TYPE.MONTHLY
          ? planData?.monthlyPriceId
          : planData?.yearlyPriceId;
    }

    let checkoutObject = {
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: metadata,
      customer_email: userData?.email,
      mode: "subscription",
      success_url: `${process.env.LIVE_URL}/subscription/plan`,
      cancel_url: `${process.env.LIVE_URL}/subscription/plan`,
    };

    const checkoutSession = await stripe.checkout.sessions.create(
      checkoutObject
    );

    if (!checkoutSession?.url) {
      throw new Error("Failed to create checkout session");
    }

    return checkoutSession?.url;
  }
};
