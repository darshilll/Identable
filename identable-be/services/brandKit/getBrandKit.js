import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;

export const getBrandKit = async (entry) => {
  let {
    user: { _id, currentPageId },
  } = entry;

  let brandkitData = await dbService.findOneRecord("BrandkitModel", {
    pageId: currentPageId,
    isDeleted: false,
  });

  return brandkitData;
};
 