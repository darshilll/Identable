import dbService from "../../utilities/dbService";
import { failAction } from "../../utilities/response";
import Message from "../../utilities/messages";

const ObjectId = require("mongodb").ObjectID;

export const accountSettingsPermission = async (req, res, next) => {
  try {
    const userData = await dbService.findOneRecord(
      "UserModel",
      { _id: ObjectId(req.user._id) },
      {
        isBilling: 1,
        isGeneral: 1,
        isIntegration: 1,
        isAISetting: 1,
        isCookieValid: 1,
      }
    );
    if (
      userData?.isBilling &&
      userData?.isGeneral &&
      userData?.isIntegration &&
      userData?.isAISetting
    ) {
      if (!userData?.isCookieValid) {
        return res.status(406).json(failAction(Message.IntegrationExpired));        
      }
      next();
      return;
    }
    return res.status(406).json(failAction(Message.AccountSettingsNotUpdated));
  } catch (error) {
    console.error("subscriptionPermission error = ", error);
    return res.status(406).json(failAction(Message.SubscriptionExpired));
  }
};
