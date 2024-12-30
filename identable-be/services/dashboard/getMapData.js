import dbService from "../../utilities/dbService";
import { pagenationFn } from "../../utilities/pagination";
const moment = require("moment-timezone");
import { CONNECTION_STATUS } from "../../utilities/constants";
const ObjectId = require("mongodb").ObjectID;
import { PREVIEW_DATA } from "../../utilities/constants";

export const getMapData = async (entry) => {
  let {
    body: { pageId },
    user: { _id, userTimezone, isDsahboardLoaded },
  } = entry;

  if (!isDsahboardLoaded) {
    _id = ObjectId(PREVIEW_DATA.USER_ID);
    pageId = ObjectId(PREVIEW_DATA.PAGE_ID);
  }

  let currentPageId = ObjectId(pageId);

  const linkedinConnectedData = await dbService.findAllRecords(
    "LinkedinConnectedModel",
    {
      userId: _id,
      pageId: currentPageId,
      isDeleted: false,
    },
    {
      linkedinUserName: 1,
    }
  );

  let linkedinConnectedUserNameArray = linkedinConnectedData?.map(
    (obj) => obj?.linkedinUserName
  );

  const linkedinFollowersData = await dbService.findAllRecords(
    "LinkedinFollowerModel",
    {
      userId: _id,
      pageId: currentPageId,
    },
    {
      linkedinUserName: 1,
    }
  );

  let linkedinFollowersUserNameArray = linkedinFollowersData?.map(
    (obj) => obj?.linkedinUserName
  );

  let linkedinUserNameArray = [
    ...linkedinConnectedUserNameArray,
    ...linkedinFollowersUserNameArray,
  ];

  let where = {
    username: {
      $in: linkedinUserNameArray,
    },
  };

  let aggregate = [
    {
      $match: where,
    },
    {
      $group: {
        _id: {
          country: "$country",
          city: "$city",
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        count: -1,
      }
    },
    // Stage 3: Group by industry and gender, and collect age groups
    {
      $group: {
        _id: "$_id.country",
        data: {
          $push: {
            city: "$_id.city",
            count: "$count",
          },
        },
      },
    },
    {
      $match: {
        _id: { $ne: null },
      },
    },
    {
      $project: {
        _id: 0,
        country: "$_id",
        data: 1,
      },
    },
  ];

  const data = await dbService.aggregateData(
    "LinkedinUserDataModel",
    aggregate
  );

  return data;
};
