import dbService from "../../utilities/dbService";

import { getCardList } from "../../utilities/stripe/getCardList";
import { getCustomerDetails } from "../../utilities/stripe/getCustomerDetails";

const ObjectId = require("mongodb").ObjectID;

export const cardList = async (entry) => {
  let {
    body: {},
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

  //get Card
  let cardData = await getCardList({ stripeCustomerId });
  if (!cardData.status) {
    throw new Error(cardData.message);
  }
  let cardArray = cardData.stripeSources;

  let stripeCustomerData = await getCustomerDetails({ stripeCustomerId });
  if (!stripeCustomerData.status) {
    throw new Error(cardData.message);
  }

  let newCardArray = [];
  for (let i = 0; i < cardArray.length; i++) {
    const card = cardArray[i];
    let isDefaultCard =
      stripeCustomerData.stripeSources?.default_source == card.id;
    newCardArray.push({
      brand: card.brand,
      exp_month: card.exp_month,
      exp_year: card.exp_year,
      id: card.id,
      last4: card.last4,
      address_zip: card.address_zip,
      isDefaultCard: isDefaultCard,
    });
  }

  return newCardArray;
};
