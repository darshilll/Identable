import dbService from "../../utilities/dbService";
import { RECURRING_TYPE } from "../../utilities/constants";

const ObjectId = require("mongodb").ObjectID;

export const updateAccountSettingFlag = async (entry) => {
  let {
    body: { isGeneral, isIntegration, isAISetting, isBilling,isBrandInfo, isAutoAiSetting },
    user: { _id },
  } = entry;

  let updateObj = {
    updatedAt: Date.now(),
  };
  if (isGeneral) {
    updateObj = {
      ...updateObj,
      isGeneral: isGeneral,
    };
  }
  if (isIntegration) {
    updateObj = {
      ...updateObj,
      isIntegration: isIntegration,
    };
  }
  if (isAISetting) {
    updateObj = {
      ...updateObj,
      isAISetting: isAISetting,
    };
  }
  if (isBilling) {
    updateObj = {
      ...updateObj,
      isBilling: isBilling,
    };
  }
  if (isBrandInfo) {
    updateObj = {
      ...updateObj,
      isBrandInfo: isBrandInfo,
    };
  } if (isAutoAiSetting) {
    updateObj = {
      ...updateObj,
      isAutoAiSetting: isAutoAiSetting,
    };
  }

  await dbService.updateOneRecords("UserModel", { _id: _id }, updateObj);

  return "Account Setting flag updated successfully";
};
