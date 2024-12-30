import dbService from "../../utilities/dbService";
import { pagenationFn } from "../../utilities/pagination";
const moment = require("moment-timezone");
import { CONNECTION_STATUS } from "../../utilities/constants";

export const getCampaignData = async (entry) => {
  let {
    user: { _id, userTimezone, currentPageId },
  } = entry;

  let where = {
    userId: _id,
    isDeleted: false,
    pageId: currentPageId,
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
    // {
    //   $match: {
    //     "connections.isLinkedinConnection": false,
    //   },
    // },
    {
      $group: {
        _id: "$_id",
        campaignName: { $first: "$campaignName" },
        createdAt: { $first: "$createdAt" },
        isEnabled: { $first: "$isEnabled" },
        count: {
          $sum: { $cond: [{ $ifNull: ["$connections", false] }, 1, 0] },
        },
        prospectCount: {
          $sum: { $cond: [{ $eq: ["$connections.currentStatus", ""] }, 1, 0] },
        },
        warmingUpCount: {
          $sum: {
            $cond: [
              {
                $in: [
                  "$connections.currentStatus",
                  [
                    CONNECTION_STATUS.PROFILE_VISITNG,
                    CONNECTION_STATUS.PROFILE_VISITED,
                    CONNECTION_STATUS.COMMENTING,
                    CONNECTION_STATUS.COMMENTED,
                  ],
                ],
              },
              1,
              0,
            ],
          },
        },
        followedCount: {
          $sum: {
            $cond: [
              {
                $in: [
                  "$connections.currentStatus",
                  [CONNECTION_STATUS.FOLLOWING, CONNECTION_STATUS.FOLLOWED],
                ],
              },
              1,
              0,
            ],
          },
        },
        connectingCount: {
          $sum: {
            $cond: [
              {
                $in: [
                  "$connections.currentStatus",
                  [CONNECTION_STATUS.CONNECTING, CONNECTION_STATUS.CONNECTED],
                ],
              },
              1,
              0,
            ],
          },
        },
        ignoredCount: {
          $sum: {
            $cond: [
              {
                $eq: ["$connections.currentStatus", CONNECTION_STATUS.IGNORED],
              },
              1,
              0,
            ],
          },
        },
        droppedCount: {
          $sum: {
            $cond: [
              {
                $eq: ["$connections.currentStatus", CONNECTION_STATUS.DROPPED],
              },
              1,
              0,
            ],
          },
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
        prospectCount: "$prospectCount",
        warmingUpCount: "$warmingUpCount",
        followedCount: "$followedCount",
        connectingCount: "$connectingCount",
        ignoredCount: "$ignoredCount",
        droppedCount: "$droppedCount",
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

  const timeZone = userTimezone;
  const now = moment.tz(timeZone);
  let nextJobTime = moment.tz(timeZone).startOf("day");
  while (nextJobTime.isSameOrBefore(now)) {
    nextJobTime.add(2, "hours");
  }
  let nexyJobTimeString = nextJobTime.format("YYYY-MM-DD HH:mm:ss");

  //All Campaign Data

  let condition = {
    userId: _id,
  };

  const connectedCount = await dbService.recordsCount(
    "LinkedinConnectedModel",
    {
      ...condition,
      isDeleted: false,
    }
  );

  const prospectCount = await dbService.recordsCount(
    "LinkedinConnectionModel",
    {
      ...condition,
      isLinkedinConnection: false,
      currentStatus: "",
    }
  );

  const warmingUpCount = await dbService.recordsCount(
    "LinkedinConnectionModel",
    {
      isLinkedinConnection: false,
      ...condition,
      currentStatus: {
        $in: [
          CONNECTION_STATUS.PROFILE_VISITNG,
          CONNECTION_STATUS.PROFILE_VISITED,
          CONNECTION_STATUS.COMMENTING,
          CONNECTION_STATUS.COMMENTED,
        ],
      },
    }
  );

  const followedCount = await dbService.recordsCount(
    "LinkedinConnectionModel",
    {
      ...condition,
      isLinkedinConnection: false,
      currentStatus: {
        $in: [CONNECTION_STATUS.FOLLOWING, CONNECTION_STATUS.FOLLOWED],
      },
    }
  );

  const connectingCount = await dbService.recordsCount(
    "LinkedinConnectionModel",
    {
      ...condition,
      isLinkedinConnection: false,
      currentStatus: {
        $in: [CONNECTION_STATUS.CONNECTING, CONNECTION_STATUS.CONNECTED],
      },
    }
  );

  const ignoredCount = await dbService.recordsCount("LinkedinConnectionModel", {
    ...condition,
    isLinkedinConnection: false,
    currentStatus: CONNECTION_STATUS.IGNORED,
  });

  const droppedCount = await dbService.recordsCount("LinkedinConnectionModel", {
    ...condition,
    isLinkedinConnection: false,
    currentStatus: CONNECTION_STATUS.DROPPED,
  });

  let prospectsData = {
    connectedCount: connectedCount,
    warmingUpCount: warmingUpCount,
    prospectCount: prospectCount,
    followedCount: followedCount,
    connectingCount: connectingCount,
    ignoredCount: ignoredCount,
    droppedCount: droppedCount,
  };

  return {
    prospectsData: prospectsData,
    campaignData: newData,
    nextJobTime: nexyJobTimeString,
  };
};
