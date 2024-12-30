import dbService from "../../../utilities/dbService";
import {
  RECURRING_TYPE,
  SUBSCRIPTION_STATUS,
  CANCEL_REASON,
} from "../../../utilities/constants";

const ObjectId = require("mongodb").ObjectID;

const env = process.env.NODE_ENV ? process.env.NODE_ENV : "dev";
var stripeKey = process.env.STRIPE;
var stripe = require("stripe")(stripeKey);

export const invoicePaidEvent = async (event) => {
  let data = event?.data?.object;

  const subscriptionData = await dbService.findOneRecord("SubscriptionModel", {
    stripeCustomerId: data?.customer,
  });

  if (!subscriptionData) {
    return false;
  }

  if (!subscriptionData?.stripeSubscriptionId) {
    return false;
  }

  const subscription = await stripe.subscriptions.retrieve(
    subscriptionData?.stripeSubscriptionId
  );

  if (subscription) {
    let stripePlanId = subscription?.plan?.id;

    if (stripePlanId) {
      const yearlyPlanData = await dbService.findOneRecord(
        "PlanModel",
        {
          yearlyPriceId: stripePlanId,
        },
        { _id: 1 }
      );

      if (yearlyPlanData) {
        await subscribeCurrentPlan({
          userId: subscriptionData?.userId,
          planId: yearlyPlanData?._id,
          recurringType: RECURRING_TYPE.YEARLY,
        });
      } else {
        const monthlyPlanData = await dbService.findOneRecord(
          "PlanModel",
          {
            monthlyPriceId: stripePlanId,
          },
          { _id: 1 }
        );

        if (monthlyPlanData) {
          await subscribeCurrentPlan({
            userId: subscriptionData?.userId,
            planId: monthlyPlanData?._id,
            recurringType: RECURRING_TYPE.MONTHLY,
          });
        }
      }
    }
  }

  const userData = await dbService.findOneRecord(
    "UserModel",
    {
      _id: subscriptionData?.userId,
    },
    { proxy: 1 }
  );

  if (!userData?.proxy) {
    const proxyData = await dbService.findOneRecord("ProxyModel", {
      isUsed: false,
    });

    if (proxyData) {
      await dbService.updateOneRecords(
        "UserModel",
        {
          _id: userData?._id,
        },
        {
          proxy: proxyData?.proxy,
        }
      );

      await dbService.updateOneRecords(
        "ProxyModel",
        {
          _id: proxyData?._id,
        },
        {
          isUsed: true,
        }
      );
    }
  }
};

export const subscribeCurrentPlan = async (entry) => {
  let { userId, planId, recurringType } = entry;

  let renewCycleDate = new Date();
  if (recurringType == RECURRING_TYPE.YEARLY) {
    renewCycleDate.setFullYear(renewCycleDate.getFullYear() + 1);
  } else {
    renewCycleDate.setMonth(renewCycleDate.getMonth() + 1);
  }

  const trialPlan = await dbService.findOneRecord("PlanModel", {
    _id: ObjectId(planId),
  });

  await dbService.updateOneRecords(
    "SubscriptionModel",
    { userId: ObjectId(userId) },
    {
      planId: trialPlan?._id,
      subscriptionStatus: SUBSCRIPTION_STATUS.ACTIVE,
      lastRenewDate: new Date(),
      renewCycleDate: renewCycleDate,
      updatedAt: Date.now(),
      credit: trialPlan?.credit,
    }
  );
};
