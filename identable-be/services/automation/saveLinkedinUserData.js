const moment = require("moment-timezone");
import dbService from "../../utilities/dbService";
import { prospectDataEvent } from "../socketEvent/prospectDataEvent";

const ObjectId = require("mongodb").ObjectID;

export const saveLinkedinUserData = async (entry) => {
  let {
    body: { data, userId, pageId },
  } = entry;

  const userData = await dbService.findOneRecord(
    "UserModel",
    {
      _id: ObjectId(userId),
    },
    {
      _id: 1,
      timezone: 1,
    }
  );

  if (!userData) {
    throw new Error("User not found");
  }

  let bulkDataArray = [];
  let bulkDataConnectedArray = [];
  let bulkDataFollowersArray = [];

  for (let i = 0; i < data?.length; i++) {
    const dataDic = data[i];

    let doc = {
      companyName: dataDic?.industry?.name,
      username: dataDic?.username,
      location: dataDic?.location,
      email: dataDic?.email,
      phone: dataDic?.phone,
      birthday: dataDic?.birthday,
      industry: dataDic?.industry,
      updatedAt: Date.now(),
      isScrappedDetails: true,
      scrappedDetailsAt: Date.now(),
    };

    if (dataDic?.location) {
      const arr = dataDic?.location?.split(",");
      if (arr?.length > 0) {
        let country = "";

        if (arr[arr?.length - 1]) {
          country = arr[arr?.length - 1];
        }

        doc = {
          ...doc,
          city: arr[0],
          country: country?.trim(),
        };
      }
    }

    bulkDataArray.push({
      updateOne: {
        filter: {
          username: dataDic?.username,
        },
        update: { $set: doc },
        upsert: true,
      },
    });

    // Update Connected Model
    bulkDataConnectedArray.push({
      updateOne: {
        filter: {
          linkedinUserName: dataDic?.username,
          isScrappedDetails: { $ne: true },
        },
        update: {
          $set: {
            isScrappedDetails: true,
          },
        },
        upsert: true,
      },
    });

    // Update Followers Model
    bulkDataFollowersArray.push({
      updateOne: {
        filter: {
          linkedinUserName: dataDic?.username,
          isScrappedDetails: { $ne: true },
        },
        update: {
          $set: {
            isScrappedDetails: true,
          },
        },
        upsert: true,
      },
    });
  }

  if (bulkDataArray?.length > 0) {
    await dbService.updateBulkRecords("LinkedinUserDataModel", bulkDataArray);
    await dbService.updateBulkRecords(
      "LinkedinConnectedModel",
      bulkDataConnectedArray
    );
    await dbService.updateBulkRecords(
      "LinkedinFollowerModel",
      bulkDataFollowersArray
    );
  }

  return "Linkedin user data saved successfully";
};
