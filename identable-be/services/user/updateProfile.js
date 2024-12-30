import dbService from "../../utilities/dbService";
import { RECURRING_TYPE } from "../../utilities/constants";

const ObjectId = require("mongodb").ObjectID;

export const updateProfile = async (entry) => {
  let {
    body: { timezone, countryCode, phoneNumber },
    user: { _id },
  } = entry;

  let updateData = {
    updatedAt: Date.now(),
    isGeneral: true,
  };

  if (timezone) {
    updateData.timezone = timezone;
  }

  if (countryCode) {
    updateData.countryCode = countryCode;
  }

  if (phoneNumber) {
    updateData.phoneNumber = phoneNumber;
  }

  await dbService.updateOneRecords("UserModel", { _id: _id }, updateData);

  return "Profile updated successfully";
};

