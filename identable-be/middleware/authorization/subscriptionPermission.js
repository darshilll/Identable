import dbService from "../../utilities/dbService";
import { SUBSCRIPTION_STATUS } from "../../utilities/constants";
import Message from "../../utilities/messages";
import { failAction } from "../../utilities/response";

const ObjectId = require("mongodb").ObjectID;

export const subscriptionPermission = async (req, res, next) => {
  try {
    const subscriptionData = await dbService.findOneRecord(
      "SubscriptionModel",
      { userId: ObjectId(req.user._id) },
      { subscriptionStatus: 1 }
    );

    if (
      subscriptionData?.subscriptionStatus == SUBSCRIPTION_STATUS.ACTIVE ||
      subscriptionData?.subscriptionStatus == SUBSCRIPTION_STATUS.TRIAL
    ) {
      next();
      return;
    }
    return res.status(406).json(failAction(Message.SubscriptionExpired));
  } catch (error) {
    console.error("subscriptionPermission error = ", error);
    return res.status(406).json(failAction(Message.SubscriptionExpired));
  }
};
