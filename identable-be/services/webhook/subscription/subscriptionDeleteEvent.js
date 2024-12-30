import dbService from "../../../utilities/dbService";
import {
  RECURRING_TYPE,
  SUBSCRIPTION_STATUS,
  CANCEL_REASON,
} from "../../../utilities/constants";

const ObjectId = require("mongodb").ObjectID;

export const subscriptionDeleteEvent = async (event) => {
  let data = event?.data?.object;

  const subscriptionData = await dbService.findOneRecord(
    "SubscriptionModel",
    {
      stripeCustomerId: data?.customer,
    },
    { userId: 1 }
  );

  if (!subscriptionData) {
    return false;
  }

  if (subscriptionData) {
    await dbService.updateOneRecords(
      "SubscriptionModel",
      {
        _id: subscriptionData?._id,
      },
      {
        subscriptionStatus: SUBSCRIPTION_STATUS.CANCEL,
        cancelReason: CANCEL_REASON.SUBSCRIPTION_CANCELLED,
      }
    );

    const userData = await dbService.findOneRecord(
      "UserModel",
      {
        _id: subscriptionData?.userId,
      },
      { proxy: 1 }
    );

    if (userData) {
      await dbService.updateOneRecords(
        "ProxyModel",
        {
          proxy: userData?.proxy,
        },
        {
          isUsed: false,
        }
      );

      await dbService.updateOneRecords(
        "UserModel",
        {
          _id: userData?._id,
        },
        {
          proxy: "",
        }
      );
    }
  }
};
