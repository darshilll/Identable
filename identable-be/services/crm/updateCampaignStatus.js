import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;

export const updateCampaignStatus = async (entry) => {
  let {
    body: { campaignId, isActive },
    user: { _id },
  } = entry;

  await dbService.updateOneRecords(
    "CampaignModel",
    { _id: ObjectId(campaignId) },
    {
      isEnabled: isActive,
    }
  );

  return "Campaign status successfully";
};
