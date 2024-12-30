import dbService from "../../utilities/dbService";
import { SUBSCRIPTION_STATUS } from "../../utilities/constants";

const ObjectId = require("mongodb").ObjectID;

export const getAISetting = async (entry) => {
  let {
    body: {},
    user: { _id },
  } = entry;

  const settingData = await dbService.findAllRecords(
    "AIAdvanceSettingModel",
    {
      userId: _id,
    },
    {
      pageId: 1,
      keyword: 1,
      about: 1,
      pointOfView: 1,
      targetAudience: 1,
      objective: 1,
      callOfAction: 1,
      about: 1,
      pointOfView: 1,
      formality: 1,
      tone: 1,
      language: 1,
      chatGPTVersion: 1,
      website: 1,
      sellType: 1,
    }
  );

  return {
    settingData,
  };
};
