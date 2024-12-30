import dbService from "../../../utilities/dbService";
import {
  RECURRING_TYPE,
  SUBSCRIPTION_STATUS,
  CANCEL_REASON,
} from "../../../utilities/constants";

const ObjectId = require("mongodb").ObjectID;

export const subscriptionUpdateEvent = async (event) => {
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

  // if (data?.items?.data?.length > 0) {
  //   let itemObj = data?.items?.data[0];
  //   if (itemObj?.plan?.id) {
  //     let planId = itemObj?.plan?.id;

  //     const yearlyPlanData = await dbService.findOneRecord(
  //       "PlanModel",
  //       {
  //         yearlyPriceId: planId,
  //       },
  //       { _id: 1 }
  //     );

  //     if (yearlyPlanData) {
  //     }
  //   }
  // }

  await dbService.updateOneRecords(
    "SubscriptionModel",
    { userId: subscriptionData?.userId },
    {
      subscriptionStatus: data?.status,
    }
  );
};
