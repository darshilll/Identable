import dbService from "../../utilities/dbService";
import { pagenationFn } from "../../utilities/pagination";
const moment = require("moment-timezone");
import { CONNECTION_STATUS } from "../../utilities/constants";
const ObjectId = require("mongodb").ObjectID;
import { PREVIEW_DATA } from "../../utilities/constants";

export const getCampaignData = async (entry) => {
  let {
    user: { _id, userTimezone, isDsahboardLoaded },
    body: { pageId },
  } = entry;

  if (!isDsahboardLoaded) {
    _id = ObjectId(PREVIEW_DATA.USER_ID);
    pageId = ObjectId(PREVIEW_DATA.PAGE_ID);
  }

  let where = {
    userId: _id,
    isDeleted: false,
    pageId: ObjectId(pageId),
  };

  let aggregate = [
    {
      $match: where,
    },
    {
      $lookup: {
        from: "linkedinconnections",
        localField: "_id",
        foreignField: "campaignId",
        as: "connections",
      },
    },
    {
      $unwind: { path: "$connections", preserveNullAndEmptyArrays: true },
    },
    {
      $group: {
        _id: "$_id",
        campaignName: { $first: "$campaignName" },
        createdAt: { $first: "$createdAt" },
        isEnabled: { $first: "$isEnabled" },
        count: {
          $sum: { $cond: [{ $ifNull: ["$connections", false] }, 1, 0] },
        },
      },
    },
    {
      $project: {
        _id: "$_id",
        campaignName: "$campaignName",
        createdAt: "$createdAt",
        isEnabled: "$isEnabled",
        count: "$count",
      },
    },
  ];

  const data = await dbService.aggregateData("CampaignModel", aggregate);

  let newData = [];
  for (let i = 0; i < data?.length; i++) {
    const dataDic = data[i];

    const connectionCount = await dbService.recordsCount(
      "LinkedinConnectedModel",
      {
        campaignId: dataDic._id,
        isDeleted: false,
      }
    );

    newData.push({
      ...dataDic,
      connectedCount: connectionCount,
    });
  }

  return {
    campaignData: newData,
  };
};
