import dbService from "../../utilities/dbService";

const ObjectId = require("mongodb").ObjectID;

const env = process.env.NODE_ENV ? process.env.NODE_ENV : "dev";
var stripeKey = process.env.STRIPE;
var stripe = require("stripe")(stripeKey);

export const buyCredit = async (entry) => {
  let {
    body: { credit, successUrl, cancelUrl },
    user: { _id },
  } = entry;

  let priceId = "price_1PkphiSHUMHVbxMle6sA4uqi";

  if (credit == 200) {
    if (env == "production") {
      priceId = "price_1PuuMQSHUMHVbxMl3rrK1xRS";
    } else {
      priceId = "price_1PkphiSHUMHVbxMle6sA4uqi";
    }
  } else if (credit == 450) {
    if (env == "production") {
      priceId = "price_1PuuMpSHUMHVbxMlTPW5UxCH";
    } else {
      priceId = "price_1PkqQ7SHUMHVbxMlCNsRQSWF";
    }
  } else if (credit == 800) {
    if (env == "production") {
      priceId = "price_1PuuOHSHUMHVbxMlr5dqKWP0";
    } else {
      priceId = "price_1PkqRNSHUMHVbxMlqwCE40RZ";
    }
  } else {
    throw new Error("Invalid Credit");
  }

  const userData = await dbService.findOneRecord(
    "UserModel",
    {
      _id: _id,
      isDeleted: false,
    },
    { _id: 1, email: 1 }
  );

  const subscriptionData = await dbService.findOneRecord(
    "SubscriptionModel",
    {
      userId: ObjectId(_id),
    },
    { stripeSubscriptionId: 1, stripeCustomerId: 1 }
  );

  if (!subscriptionData) {
    throw new Error("Subscription not found");
  }

  if (!subscriptionData?.stripeSubscriptionId) {
    throw new Error("You can not buy credit. Please subscribe plan");
  }

  let metadata = {
    userId: userData?._id?.toString(),
    credit: credit,
  };

  let checkoutObject = {
    customer: subscriptionData?.stripeCustomerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    metadata: metadata,
    mode: "payment",
    success_url: `${successUrl}`,
    cancel_url: `${cancelUrl}`,
  };

  const checkoutSession = await stripe.checkout.sessions.create(checkoutObject);

  if (!checkoutSession?.url) {
    throw new Error("Failed to create checkout session");
  }

  return checkoutSession?.url;

  return "card deleted successfully";
};
