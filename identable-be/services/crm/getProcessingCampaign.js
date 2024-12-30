import dbService from "../../utilities/dbService";
import { pagenationFn } from "../../utilities/pagination";
const moment = require("moment-timezone");
import { CONNECTION_STATUS } from "../../utilities/constants";

export const getProcessingCampaign = async (entry) => {
  let {
    user: { _id },
  } = entry;

  const campaignData = await dbService.findOneRecord(
    "CampaignModel",
    {
      userId: _id,
      isProcessing: true,
    },
    {
      _id: 1,
      campaignName: 1,
    }
  );

  return campaignData;
};
