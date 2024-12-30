import dbService from "../../utilities/dbService";
import { pagenationFn } from "../../utilities/pagination";
const moment = require("moment-timezone");
import { CONNECTION_STATUS, FOLLOW_STATUS } from "../../utilities/constants";

export const getCompanyCampaignData = async (entry) => {
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
      $lookup: {
        from: "linkedinconnections",
        let: {
          id: "$_id",
        },
        pipeline: [
          {
            $match: {
              isLinkedinConnection: false,
              $expr: {
                $eq: ["$campaignId", "$$id"],
              },
            },
          },
          {
            $group: {
              _id: "$campaignId",
              prospectCount: {
                $sum: {
                  $cond: [{ $eq: ["$currentStatus", ""] }, 1, 0],
                },
              },
              warmingUpCount: {
                $sum: {
                  $cond: [
                    {
                      $in: [
                        "$currentStatus",
                        [
                          CONNECTION_STATUS.PROFILE_VISITNG,
                          CONNECTION_STATUS.PROFILE_VISITED,
                          CONNECTION_STATUS.COMMENTING,
                          CONNECTION_STATUS.COMMENTED,
                          CONNECTION_STATUS.FOLLOWING,
                          CONNECTION_STATUS.FOLLOWED,
                          CONNECTION_STATUS.CONNECTING,
                        ],
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
            },
          },
        ],
        as: "connectionData",
      },
    },
    {
      $unwind: { path: "$followingData", preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: "linkedinfollowings",
        let: {
          id: "$_id",
        },
        pipeline: [
          {
            $match: {
              isFollowed: false,
              $expr: {
                $eq: ["$campaignId", "$$id"],
              },
            },
          },
          {
            $group: {
              _id: "$campaignId",
              queueCount: {
                $sum: {
                  $cond: [
                    {
                      $eq: ["$currentStatus", FOLLOW_STATUS.QUEUE],
                    },
                    1,
                    0,
                  ],
                },
              },
              followingCount: {
                $sum: {
                  $cond: [
                    { $eq: ["$currentStatus", FOLLOW_STATUS.SENT] },
                    1,
                    0,
                  ],
                },
              },
              unfollowedCount: {
                $sum: {
                  $cond: [
                    { $eq: ["$currentStatus", FOLLOW_STATUS.UNFOLLOWED] },
                    1,
                    0,
                  ],
                },
              },
              count: {
                $sum: 1,
              },
            },
          },
        ],
        as: "followingData",
      },
    },
    {
      $unwind: { path: "$followingData", preserveNullAndEmptyArrays: true },
    },
    {
      $project: {
        _id: "$_id",
        campaignName: "$campaignName",
        createdAt: "$createdAt",
        isEnabled: "$isEnabled",
        prospectCount: "$connectionData.prospectCount",
        warmingUpCount: "$connectionData.warmingUpCount",
        followingCount: "$followingData.followingCount",
        queueCount: "$followingData.queueCount",
        unfollowedCount: "$followingData.unfollowedCount",
      },
    },
  ];

  const data = await dbService.aggregateData("CampaignModel", aggregate);

  let newData = [];
  let campaignIds = [];
  for (let i = 0; i < data?.length; i++) {
    const dataDic = data[i];

    const followerCount = await dbService.recordsCount(
      "LinkedinFollowerModel",
      {
        campaignId: dataDic._id,
      }
    );

    const connectionCount = await dbService.recordsCount(
      "LinkedinConnectedModel",
      {
        campaignId: dataDic._id,
        isDeleted: false,
      }
    );

    newData.push({
      ...dataDic,
      followedCount: followerCount,
      connectedCount: connectionCount,
    });

    campaignIds.push(dataDic._id);
  }

  const timeZone = userTimezone;
  const now = moment.tz(timeZone);
  let nextJobTime = moment.tz(timeZone).startOf("day");
  while (nextJobTime.isSameOrBefore(now)) {
    nextJobTime.add(2, "hours");
  }
  let nexyJobTimeString = nextJobTime.format("YYYY-MM-DD HH:mm:ss");

  let condition = {
    userId: _id,
    pageId: currentPageId,
  };

  const followerCount = await dbService.recordsCount("LinkedinFollowerModel", {
    ...condition,
  });

  const followingCount = await dbService.recordsCount(
    "LinkedinFollowingModel",
    {
      ...condition,
      currentStatus: FOLLOW_STATUS.SENT,
    }
  );

  const queueCount = await dbService.recordsCount("LinkedinFollowingModel", {
    ...condition,
    currentStatus: FOLLOW_STATUS.QUEUE,
  });

  const unfollowedCount = await dbService.recordsCount(
    "LinkedinFollowingModel",
    {
      ...condition,
      currentStatus: FOLLOW_STATUS.UNFOLLOWED,
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
          CONNECTION_STATUS.FOLLOWING,
          CONNECTION_STATUS.FOLLOWED,
          CONNECTION_STATUS.CONNECTING,
        ],
      },
    }
  );

  const connectedCount = await dbService.recordsCount(
    "LinkedinConnectedModel",
    {
      ...condition,
      isDeleted: false,
      campaignId: { $in: campaignIds },
    }
  );

  let prospectsData = {
    followerCount: followerCount,
    prospectCount: prospectCount,
    warmingUpCount: warmingUpCount,
    connectedCount: connectedCount,
    followingCount: followingCount,
    unfollowedCount: unfollowedCount,
    queueCount: queueCount,
  };

  return {
    prospectsData: prospectsData,
    campaignData: newData,
    nextJobTime: nexyJobTimeString,
  };
};
