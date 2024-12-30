import dbService from "../../../utilities/dbService";
import {
  RECURRING_TYPE,
  SUBSCRIPTION_STATUS,
  CANCEL_REASON,
} from "../../../utilities/constants";

const ObjectId = require("mongodb").ObjectID;

export const checkoutSessionCompletedEvent = async (event) => {
  let data = event?.data?.object;

  if (
    data?.metadata?.planId &&
    data?.metadata?.userId &&
    data?.metadata?.recurringType
  ) {
    let { planId, userId, recurringType } = data?.metadata;

    let renewCycleDate = new Date();
    if (recurringType == RECURRING_TYPE.YEARLY) {
      renewCycleDate.setFullYear(renewCycleDate.getFullYear() + 1);
    } else {
      renewCycleDate.setMonth(renewCycleDate.getMonth() + 1);
    }

    const planData = await dbService.findOneRecord("PlanModel", {
      _id: ObjectId(planId),
    });

    await dbService.updateOneRecords(
      "SubscriptionModel",
      { userId: ObjectId(userId) },
      {
        planId: planData?._id,
        subscriptionStatus: SUBSCRIPTION_STATUS.ACTIVE,
        lastRenewDate: new Date(),
        renewCycleDate: renewCycleDate,
        credit: planData?.credit,
        updatedAt: Date.now(),
        stripeCustomerId: data?.customer,
        stripeSubscriptionId: data?.subscription,
        recurringType: recurringType,
        cancelReason: "",
      }
    );

    const userData = await dbService.findOneRecord(
      "UserModel",
      {
        _id: ObjectId(userId),
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
  } else if (data?.metadata?.userId && data?.metadata?.credit) {
    let { userId, credit } = data?.metadata;

    const subscriptionData = await dbService.findOneRecord(
      "SubscriptionModel",
      {
        userId: ObjectId(userId),
      },
      { additionalCredit: 1 }
    );

    if (subscriptionData) {
      let additionalCredit = credit;
      if (subscriptionData?.additionalCredit) {
        additionalCredit = subscriptionData?.additionalCredit + credit;
      }

      await dbService.updateOneRecords(
        "SubscriptionModel",
        { _id: subscriptionData?._id },
        {
          additionalCredit: additionalCredit,
        }
      );
    }
  }
};
