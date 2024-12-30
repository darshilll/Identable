import dbService from "../../utilities/dbService";

export const getCampaignList = async (entry) => {
  let {
    user: { _id, currentPageId },
  } = entry;

  let where = {
    userId: _id,
    isDeleted: false,
    pageId: currentPageId,
  };

  const data = await dbService.findAllRecords("CampaignModel", where, {
    campaignName: 1,
    _id: 1,
  });

  return data;
};
