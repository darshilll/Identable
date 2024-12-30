import dbService from "../../utilities/dbService";
import { generatePost } from "../post/generatePost";

const ObjectId = require("mongodb").ObjectID;

export const saveAISetting = async (entry) => {
  let {
    body: { advanceSetting, chatGPTVersion },
    user: { _id },
  } = entry;

  await dbService.deleteManyRecords("AIAdvanceSettingModel", {
    userId: _id,
  });

  let updateUserObj = {
    chatGPTVersion: chatGPTVersion,
    isAISetting: true,
  };

  const userData = await dbService.findOneRecord(
    "UserModel",
    {
      _id: _id,
    },
    {
      currentPageId: 1,
    }
  );

  let currentPageId = userData?.currentPageId;
  if (!userData?.currentPageId) {
    let filterArray = advanceSetting?.filter((x) => x?.type == "profile");

    if (filterArray?.length > 0) {
      updateUserObj = {
        ...updateUserObj,
        currentPageId: filterArray[0].pageId,
      };

      currentPageId = filterArray[0].pageId;
    }
  }

  await dbService.updateOneRecords("UserModel", { _id: _id }, updateUserObj);

  let bulkDataArray = [];
  for (let i = 0; i < advanceSetting?.length; i++) {
    const obj = advanceSetting[i];

    let insertObj = {
      userId: _id,
      pageId: obj?.pageId,
      formality: obj?.formality,
      tone: obj?.tone,
      language: obj?.language,
      keyword: obj?.keyword,
      about: obj?.about,
      pointOfView: obj?.pointOfView,
      targetAudience: obj?.targetAudience,
      objective: obj?.objective,
      callOfAction: obj?.callOfAction,
      type: obj?.type,
      brand : obj?.brand,
      website: obj?.website,
      sellType: obj?.sellType,
      chatGPTVersion: chatGPTVersion,
      createdAt: Date.now(),
    };

    if (currentPageId?.toString() == obj?.pageId?.toString()) {
      insertObj = {
        ...insertObj,
        isCurrentPage: true,
      };
    }

    bulkDataArray.push({
      insertOne: {
        document: insertObj,
      },
    });
  }

  if (bulkDataArray?.length > 0) {
    await dbService.updateBulkRecords("AIAdvanceSettingModel", bulkDataArray);
  }

  generatePost({ userId: _id });

  return "Settings saved successfully";
};
