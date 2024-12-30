const moment = require("moment-timezone");
import dbService from "../../utilities/dbService";
import { prospectDataEvent } from "../socketEvent/prospectDataEvent";

const ObjectId = require("mongodb").ObjectID;

export const saveSocialSellingIndex = async (entry) => {
  let {
    body: { page_id, user_id, ssi_data },
  } = entry;

  const userData = await dbService.findOneRecord("UserModel", {
    _id: ObjectId(user_id),
  });

  if (!userData) {
    throw new Error("User not found");
  }

  const linkedinPageData = await dbService.findOneRecord(
    "LinkedinPageModel",
    {
      _id: ObjectId(page_id),
    },
    {
      _id: 1,
    }
  );

  if (!linkedinPageData) {
    throw new Error("Page not found");
  }

  await dbService.updateOneRecords(
    "LinkedinPageModel",
    {
      _id: linkedinPageData?._id,
    },
    {
      ssiData: ssi_data,
    }
  );

  return "SSI data saved successfully";
};
