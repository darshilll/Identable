import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;

export const deleteProspect = async (entry) => {
  let {
    body: { prospectId },
    user: { _id },
  } = entry;

  await dbService.deleteOneRecords("LinkedinConnectionModel", {
    _id: ObjectId(prospectId),
  });

  return "Prospect removed successfully";
};
