import dbService from "../../utilities/dbService";

const env = process.env.NODE_ENV ? process.env.NODE_ENV : "dev";
var stripeKey = process.env.STRIPE;
var stripe = require("stripe")(stripeKey);

export const manageSubscription = async (entry) => {
  let {
    body: {},
    user: { _id },
  } = entry;

  const subscriptionData = await dbService.findOneRecord(
    "SubscriptionModel",
    {
      userId: _id,
    },
    { stripeCustomerId: 1 }
  );

  if (!subscriptionData) {
    throw new Error("subscription not found");
  }

  if (!subscriptionData?.stripeCustomerId) {
    throw new Error("No any active subscription found");
  }
  const session = await stripe.billingPortal.sessions.create({
    customer: subscriptionData?.stripeCustomerId,
    configuration: "bpc_1P50OoSHUMHVbxMlhDCCahdL",
    return_url: `${process.env.LIVE_URL}/subscription/plan/`,
  });
  return session?.url;
};
