import dbService from "../../utilities/dbService";

const ObjectId = require("mongodb").ObjectID;

export const updateProfileSettings = async (entry) => {
  let {
    body: { action },
    user: { _id },
  } = entry;

  if (action == "companyPageVisited") {
    await dbService.updateOneRecords(
      "UserModel",
      {
        _id: _id,
      },
      {
        isCompanyPageVisited: true,
      }
    );
  }

  return "Success";
};
