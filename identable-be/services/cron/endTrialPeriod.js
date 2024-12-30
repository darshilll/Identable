import dbService from "../../utilities/dbService";
import { SUBSCRIPTION_STATUS, CANCEL_REASON } from "../../utilities/constants";

export const endTrialPeriod = async () => {
  let currentStart = new Date();
  currentStart.setHours(0, 0, 0, 0);
  let currentEnd = new Date();
  currentEnd.setHours(23, 59, 59, 999);

  const subscriptionArray = await dbService.findAllRecords(
    "SubscriptionModel",
    {
      isDeleted: false,
      subscriptionStatus: SUBSCRIPTION_STATUS.TRIAL,
      renewCycleDate: {
        $lte: currentEnd.getTime(),
      },
    },
    { userId: 1 }
  );

  if (subscriptionArray?.length > 0) {
    let userIds = subscriptionArray?.map((obj) => obj?.userId);
    const userArray = await dbService.findAllRecords(
      "UserModel",
      {
        _id: { $in: userIds },
      },
      { proxy: 1 }
    );

    if (userArray?.length > 0) {
      let proxies = userArray?.map((obj) => obj?.proxy);

      await dbService.updateManyRecords(
        "ProxyModel",
        {
          proxy: { $in: proxies },
        },
        {
          isUsed: false,
        }
      );

      await dbService.updateManyRecords(
        "UserModel",
        {
          _id: { $in: userIds },
        },
        {
          proxy: "",
        }
      );
    }
  }

  await dbService.updateManyRecords(
    "SubscriptionModel",
    {
      isDeleted: false,
      subscriptionStatus: SUBSCRIPTION_STATUS.TRIAL,
      renewCycleDate: {
        $lte: currentEnd.getTime(),
      },
    },
    {
      subscriptionStatus: SUBSCRIPTION_STATUS.CANCEL,
      cancelReason: CANCEL_REASON.TRIAL_END,
    }
  );
};
