import dbService from "../../utilities/dbService";

import { deleteStripeCard } from "../../utilities/stripe/deleteStripeCard";

const ObjectId = require("mongodb").ObjectID;

export const deleteCard = async (entry) => {
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

  //card delete
  let deleteCardResponse = await deleteStripeCard({
    stripeCustomerId,
    cardSourceId,
  });

  if (!deleteCardResponse.status) {
    throw new Error(deleteCardResponse.message);
  }

  return "card deleted successfully";
};
