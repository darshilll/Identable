const moment = require("moment-timezone");
import dbService from "../../utilities/dbService";
import { prospectDataEvent } from "../socketEvent/prospectDataEvent";
import { CONNECTION_STATUS } from "../../utilities/constants";

const ObjectId = require("mongodb").ObjectID;

export const saveLinkedinConnectionData = async (entry) => {
  let {
    body: { connections, user_id, page_id, refresh_connections },
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

  let bulkDataArray = [];
  let bulkDataLinkedinUserArray = [];

  for (let i = 0; i < connections?.length; i++) {
    const postDic = connections[i];

    let doc = {
      userId: ObjectId(user_id),
      pageId: ObjectId(page_id),
      linkedinUserName: postDic?.username,
      timeConnected: postDic?.time_connected,
      createdAt: Date.now(),
      isDeleted: false,
    };

    bulkDataArray.push({
      updateOne: {
        filter: {
          linkedinUserName: postDic?.username,
          pageId: ObjectId(page_id),
        },
        update: { $set: doc },
        upsert: true,
      },
    });

    let doc1 = {
      username: postDic?.username,
      imageSrc: postDic?.image_src,
      name: postDic?.name,
      profileUrl: postDic?.profile_url,
      occupation: postDic?.occupation,
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
    await dbService.updateBulkRecords("LinkedinConnectedModel", bulkDataArray);
    await dbService.updateBulkRecords(
      "LinkedinUserDataModel",
      bulkDataLinkedinUserArray
    );
  }

  const prospectData = await dbService.findAllRecords(
    "LinkedinConnectionModel",
    {
      userId: ObjectId(user_id),
      isLinkedinConnection: false,
    },
    {
      _id: 1,
      campaignId: 1,
      linkedinUserName: 1,
    }
  );

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

  let prospectBulkDataArray = [];
  let connectionBulkDataArray = [];

  if (prospectData?.length > 0 && connectionData?.length > 0) {
    for (let i = 0; i < connectionData?.length; i++) {
      const connectionsDic = connectionData[i];

      const filterArray = prospectData?.filter(
        (x) => x?.username == connectionsDic?.linkedinUserName
      );
      if (filterArray.length > 0) {
        prospectBulkDataArray.push({
          updateOne: {
            filter: {
              _id: filterArray[0]?._id,
            },
            update: {
              $set: {
                isLinkedinConnection: true,
                acceptedAt: Date.now(),
                isDeleted: false,
              },
            },
          },
        });

        connectionBulkDataArray.push({
          updateOne: {
            filter: {
              _id: connectionsDic._id,
            },
            update: {
              $set: {
                isConnected: true,
                campaignId: filterArray[0]?.campaignId,
              },
            },
          },
        });
      }
    }

    if (prospectBulkDataArray?.length > 0) {
      await dbService.updateBulkRecords(
        "LinkedinConnectionModel",
        prospectBulkDataArray
      );
    }

    if (connectionBulkDataArray?.length > 0) {
      await dbService.updateBulkRecords(
        "LinkedinConnectedModel",
        connectionBulkDataArray
      );
    }
  }

  // ================  UPDATE INGORE STATUS ================

  let startDate = new Date();
  startDate.setDate(startDate.getDate() - 10);

  await dbService.updateManyRecords(
    "LinkedinConnectionModel",
    {
      userId: ObjectId(user_id),
      connectingAt: {
        $lt: startDate.getTime(),
      },
      currentStatus: CONNECTION_STATUS.CONNECTING,
    },
    {
      currentStatus: CONNECTION_STATUS.IGNORED,
    }
  );

  // ================  UPDATE DROPPED STATUS ================

  if (!refresh_connections) {
    let usernameArray = connections?.map((obj) => obj?.username);

    if (usernameArray?.length > 0) {
      await dbService.updateManyRecords(
        "LinkedinConnectionModel",
        {
          userId: ObjectId(user_id),
          isLinkedinConnection: true,
          linkedinUserName: {
            $nin: usernameArray,
          },
        },
        {
          currentStatus: CONNECTION_STATUS.DROPPED,
          isLinkedinConnection: false,
        }
      );

      await dbService.updateManyRecords(
        "LinkedinConnectedModel",
        {
          userId: ObjectId(user_id),
          linkedinUserName: {
            $nin: usernameArray,
          },
        },
        {
          isDeleted: true,
        }
      );
    }
  }

  return "Linkedin connections data saved successfully";
};
