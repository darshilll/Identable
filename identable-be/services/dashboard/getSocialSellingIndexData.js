import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;

export const getSocialSellingIndexData = async (entry) => {
  let {
    user: { _id },
  } = entry;

  let filter = {
    userId: ObjectId(_id),
    type: "profile",
  };

  const socialSellingIndexData = await dbService.findOneRecord(
    "LinkedinPageModel",
    filter,
    { ssiData: 1 }
  );

  return socialSellingIndexData;
};
