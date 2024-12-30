const moment = require("moment-timezone");
import dbService from "../../../utilities/dbService";
import { prospectDataEvent } from "../../socketEvent/prospectDataEvent";

const ObjectId = require("mongodb").ObjectID;

export const saveProspectsData = async (entry) => {
  let {
    body: { page_id, prospects, user_id, campaign_id },
  } = entry;

  const userData = await dbService.findOneRecord(
    "UserModel",
    {
      _id: ObjectId(user_id),
    },
    {
      _id: 1,
      timezone: 1,
    }
  );

  if (!userData) {
    throw new Error("User not found");
  }

  const campaignData = await dbService.findOneRecord(
    "CampaignModel",
    {
      userId: ObjectId(user_id),
      _id: ObjectId(campaign_id),
    },
    {
      _id: 1,
    }
  );

  if (!campaignData) {
    throw new Error("Campaign not found");
  }

  if (prospects?.length > 0) {
    let bulkDataArray = [];
    let bulkDataLinkedinUserArray = [];

    let connectionBulkDataArray = [];

    const connectionData = await dbService.findAllRecords(
      "LinkedinConnectedModel",
      {
        userId: ObjectId(user_id),
      },
      {
        _id: 1,
        linkedinUserName: 1,
      }
    );

    const prospectArray = await dbService.findAllRecords(
      "LinkedinConnectionModel",
      {
        userId: ObjectId(user_id),
      },
      {
        _id: 1,
        linkedinUserName: 1,
      }
    );

    for (let i = 0; i < prospects?.length; i++) {
      const postDic = prospects[i];

      const filterArray = connectionData?.filter(
        (x) => x?.linkedinUserName == postDic?.username
      );

      const filterArray1 = prospectArray?.filter(
        (x) => x?.linkedinUserName == postDic?.username
      );

      if (filterArray1?.length > 0) {
        continue;
      }

      let isLinkedinConnection = false;
      if (filterArray.length > 0) {
        isLinkedinConnection = true;

        connectionBulkDataArray.push({
          updateOne: {
            filter: {
              _id: filterArray[0]._id,
            },
            update: {
              $set: {
                isConnected: true,
                campaignId: ObjectId(campaign_id),
                isDeleted: false,
              },
            },
          },
        });
      }

      let doc = {
        userId: ObjectId(user_id),
        pageId: ObjectId(page_id),
        campaignId: ObjectId(campaign_id),
        prospectType: postDic?.prospect_type,
        linkedinUserName: postDic?.username,
        createdAt: Date.now(),
        currentStatus: "",
        isLinkedinConnection: isLinkedinConnection,
      };

      bulkDataArray.push({
        updateOne: {
          filter: {
            linkedinUserName: postDic?.username,
            campaignId: ObjectId(campaign_id),
          },
          update: { $set: doc },
          upsert: true,
        },
      });

      let doc1 = {
        connectionId: postDic?.id,
        name: postDic?.name,
        profileUrl: postDic?.profile_url,
        imageSrc: postDic?.profile_image_url,
        primarySubTitle: postDic?.primary_subtitle,
        secondarySubTitle: postDic?.secondary_subtitle,
        insight: postDic?.insight,
        summary: postDic?.summary,
        isPremium: postDic?.is_premium,
        username: postDic?.username,
        updatedAt: Date.now(),
      };

      bulkDataLinkedinUserArray.push({
        updateOne: {
          filter: {
            username: postDic?.username,
          },
          update: { $set: doc1 },
          upsert: true,
        },
      });
    }

    if (bulkDataArray?.length > 0) {
      await dbService.updateBulkRecords(
        "LinkedinConnectionModel",
        bulkDataArray
      );
      await dbService.updateBulkRecords(
        "LinkedinUserDataModel",
        bulkDataLinkedinUserArray
      );
    }

    if (connectionBulkDataArray?.length > 0) {
      await dbService.updateBulkRecords(
        "LinkedinConnectedModel",
        connectionBulkDataArray
      );
    }
  }

  const connectionCount = await dbService.recordsCount(
    "LinkedinConnectionModel",
    {
      campaignId: ObjectId(campaign_id),
    }
  );

  if (connectionCount >= 800) {
    await dbService.updateOneRecords(
      "CampaignModel",
      { _id: ObjectId(campaign_id) },
      {
        isProcessing: false,
      }
    );
  }

  prospectDataEvent({
    userId: userData?._id,
    data: { dataStatus: true, count: connectionCount },
  });

  return "Prospects data saved successfully";
};
