const moment = require("moment-timezone");
import dbService from "../../utilities/dbService";
import { prospectDataEvent } from "../socketEvent/prospectDataEvent";
import { FOLLOW_STATUS } from "../../utilities/constants";

const ObjectId = require("mongodb").ObjectID;

export const saveLinkedinFollowersData = async (entry) => {
  let {
    body: { followers, user_id, page_id, refresh_followers },
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
  let bulkDataLinkedinFollowingUserArray = [];

  for (let i = 0; i < followers?.length; i++) {
    const postDic = followers[i];

    let doc = {
      userId: ObjectId(user_id),
      pageId: ObjectId(page_id),
      linkedinUserName: postDic?.username,
      timeFollowed: postDic?.time_followed,
      createdAt: Date.now(),
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
      headline: postDic?.headline,
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

    bulkDataLinkedinFollowingUserArray.push({
      updateOne: {
        filter: {
          linkedinUserName: postDic?.username,
          pageId: ObjectId(page_id),
        },
        update: { $set: { isFollowed: true } },
      },
    });
  }

  if (bulkDataArray?.length > 0) {
    await dbService.updateBulkRecords("LinkedinFollowerModel", bulkDataArray);
    await dbService.updateBulkRecords(
      "LinkedinUserDataModel",
      bulkDataLinkedinUserArray
    );
    await dbService.updateBulkRecords(
      "LinkedinFollowingModel",
      bulkDataLinkedinFollowingUserArray
    );
  }

  // ================  UPDATE UNFOLLOW STATUS ================

  if (!refresh_followers) {
    let usernameArray = followers?.map((obj) => obj?.username);

    if (usernameArray?.length > 0) {
      await dbService.updateManyRecords(
        "LinkedinFollowingModel",
        {
          userId: ObjectId(user_id),
          isFollowed: true,
          linkedinUserName: {
            $nin: usernameArray,
          },
        },
        {
          currentStatus: FOLLOW_STATUS.UNFOLLOWED,
          isFollowed: false,
        }
      );
    }
  }

  return "Linkedin followers data saved successfully";
};
