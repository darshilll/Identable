import dbService from "../../utilities/dbService";
import { getToken } from "../../utilities/stripe/getToken";
import { getCardList } from "../../utilities/stripe/getCardList";
import { addCard } from "../../utilities/stripe/addCard";
import { setDefaultCard } from "../../utilities/stripe/setDefaultCard";
import { createCustomer } from "../../utilities/stripe/createCustomer";

const ObjectId = require("mongodb").ObjectID;

export const add = async (entry) => {
  let {
    body: { cardToken, isDefaultCard },
    user: { _id },
  } = entry;

  //Get stripeCustomerId
  const userData = await dbService.findOneRecord(
    "SubscriptionModel",
    {
      userId: ObjectId(_id),
      isDeleted: false,
    },
    { stripeCustomerId: 1, _id: 1 }
  );

  if (!_id) {
    throw new Error("User not found");
  }

  let stripeCustomerId = userData?.stripeCustomerId;

  //if stripe customer id not found
  if (!stripeCustomerId) {
    let { email, firstName, lastName } = await dbService.findOneRecord(
      "UserModel",
      {
        _id: ObjectId(_id),
        isDeleted: false,
      },
      { email: 1, firstName: 1, lastName: 1 }
    );
    if (!email) {
      throw new Error("User not found");
    }

    //create stripe user
    const stripeUser = await createCustomer({
      email: email,
      name: firstName,
      lastName: lastName,
      cardToken: cardToken,
    });

    let customerId = stripeUser["customer"]["id"];
    await dbService.findOneAndUpdateRecord(
      "SubscriptionModel",
      { _id: userData?._id },
      {
        $set: { stripeCustomerId: customerId },
      }
    );

    let cardData = await getStripeCardList({ stripeCustomerId });

    if (!cardData.status) {
      throw new Error(cardData?.message);
    }

    let cardArray = cardData?.stripeSources;
    let cardTokenId = "";
    if (cardArray && cardArray?.length > 0) {
      cardTokenId = cardArray[0]?.id;
    }

    return {
      message: "card added successfully",
      cardSourceId: cardTokenId,
    };
  }

  //create Token
  let tokenResponse = await getToken({
    cardToken,
  });

  if (!tokenResponse.status) {
    throw new Error(tokenResponse.message);
  }

  let tokenFingerPrint = tokenResponse.stripeSources.card.fingerprint;

  //Get card list
  if (tokenFingerPrint) {
    let cardData = await getCardList({ stripeCustomerId });
    if (cardData.status == false) {
      throw new Error(cardData.message);
    }

    let cardArray = cardData?.stripeSources;
    const filterArray = cardArray?.filter(
      (x) => x.fingerprint === tokenFingerPrint
    );
    if (filterArray.length > 0) {
      throw new Error("This card is already added");
    }
  }

  //Add card
  let addCardResponse = await addCard({
    stripeCustomerId,
    cardToken,
  });

  if (!addCardResponse.status) {
    throw new Error(addCardResponse.message);
  }

  //Set defult card
  if (isDefaultCard) {
    let defaultResponse = await setDefaultCard({
      stripeCustomerId,
      cardSourceId: addCardResponse.stripeSources.id,
    });
  }

  return {
    message: "card added successfully",
    cardSourceId: addCardResponse.stripeSources.id,
  };
};
