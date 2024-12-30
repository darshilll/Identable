const moment = require("moment-timezone");
import dbService from "../../utilities/dbService";
import { getCampaignBoostCredit } from "./getCampaignBoostCredit";

import { checkCredit } from "../creditUsage/checkCredit";
import { updateCreditUsage } from "../creditUsage/updateCreditUsage";
import { CREDIT_TYPE } from "../../utilities/constants";

const ObjectId = require("mongodb").ObjectID;

export const activeCampaignBoosting = async (entry) => {
  let {
    body: { campaignId },
    user: { _id, userTimezone, currentPageId },
  } = entry;

  let creditData = await getCampaignBoostCredit(entry);

  await dbService.findOneAndUpdateRecord(
    "OneClickModel",
    { _id: campaignId },
    {
      $set: { isBoostCampaign: true },
    }
  );

  let postObj = {
    isBoosting: true,
    likeCount: 10,
    updatedAt: Date.now(),
  };

  await dbService.updateManyRecords(
    "PostModel",
    { oneClickId: ObjectId(campaignId) },
    postObj
  );

  await updateCreditUsage({
    userId: _id,
    pageId: currentPageId,
    creditType: CREDIT_TYPE.BOOSTING_CAMPAIGN,
    manualCredit: creditData?.credit,
  });

  return "Boosting Successfully Activated";
};
