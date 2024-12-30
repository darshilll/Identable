import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;

export const updateBrandKit = async (entry) => {
  let {
    user: { _id },
  } = entry;

  let planData = await dbService.findAllRecords("PlanModel", {
    isDeleted: false,
  });

  return planData;
};
