import dbService from "../../utilities/dbService";

import { setDefaultCard } from "../../utilities/stripe/setDefaultCard";

const ObjectId = require("mongodb").ObjectID;

export const setDefault = async (entry) => {
  let {
    body: { cardSourceId },
    user: { _id },
  } = entry;

  //Get stripeCustomerId
  const { stripeCustomerId } = await dbService.findOneRecord(
    "SubscriptionModel",
    {
      userId: ObjectId(_id),
      isDeleted: false,
    },
    { stripeCustomerId: 1 }
  );

  if (stripeCustomerId) {
    throw new Error("User customer Id found");
  }

  //set defult card
  let defaultResponse = await setDefaultCard({
    stripeCustomerId,
    cardSourceId: cardSourceId,
  });

  return "card updated successfully";
};
