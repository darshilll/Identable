import dbService from "../../utilities/dbService";

import { setDefaultCard } from "../../utilities/stripe/setDefaultCard";
import { updateCard } from "../../utilities/stripe/updateCard";

const ObjectId = require("mongodb").ObjectID;

export const update = async (entry) => {
  let {
    body: { isDefaultCard, cardSourceId, expMonth, expYear, addressZip },
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

  //card update
  let updateCardResponse = await updateCard({
    stripeCustomerId,
    cardSourceId,
    expMonth,
    expYear,
    addressZip,
  });

  if (!updateCardResponse.status) {
    throw new Error(updateCardResponse.message);
  }

  //Set defult card
  if (isDefaultCard) {
    let defaultResponse = await setDefaultCard({
      stripeCustomerId,
      cardSourceId: cardSourceId,
    });
  }

  return "card updated successfully";
};
