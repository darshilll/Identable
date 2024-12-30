const moment = require("moment");
import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;
import { PREVIEW_DATA } from "../../utilities/constants";

export const getOverviewData = async (entry) => {
  let {
    body: { startDate, endDate, pageId },
    user: { _id, currentPageId, isDsahboardLoaded },
  } = entry;

  if (!isDsahboardLoaded) {
    _id = ObjectId(PREVIEW_DATA.USER_ID);
    pageId = ObjectId(PREVIEW_DATA.PAGE_ID);
  }

  const now = moment();
  const lastStartDate = now
    .clone()
    .subtract(1, "month")
    .startOf("month")
    .valueOf();
  const lastEndDate = now.clone().subtract(1, "month").endOf("month").valueOf();

  // =========================== REACH ===========================

  let reachWhere = {
    userId: _id,
    pageId: ObjectId(pageId),

    uniqueViews: { $exists: true, $ne: null },
  };

  const lastReachResult = await getReachData({
    ...reachWhere,
    postTime: {
      $gte: lastStartDate,
      $lte: lastEndDate,
    },
  });

  const reachResult = await getReachData({
    ...reachWhere,
    postTime: {
      $gte: startDate,
      $lte: endDate,
    },
  });

  let reachCount = 0;
  let reachPer = 0;

  let uniqueViews = 0;
  let uniqueViewsPer = 0;

  let lastReachCount = 0;
  let lastUniqueViews = 0;

  if (reachResult?.length > 0) {
    reachCount = reachResult[0]?.count;
    uniqueViews = reachResult[0]?.count;
  }

  if (lastReachResult?.length > 0) {
    lastReachCount = lastReachResult[0]?.count;
    lastUniqueViews = lastReachResult[0]?.count;
  }

  if (lastReachCount > 0) {
    reachPer = ((reachCount - lastReachCount) * 100) / lastReachCount;
  }

  if (lastUniqueViews > 0) {
    uniqueViewsPer = ((uniqueViews - lastUniqueViews) * 100) / lastUniqueViews;
  }

  // =========================== AUDIENCE ===========================

  let audienceWhere = {
    userId: _id,
    pageId: ObjectId(pageId),
  };

  const audienceResult = await getAudienceData({
    ...audienceWhere,
    createdAt: {
      $lte: endDate,
    },
  });

  const lastAudienceResult = await getAudienceData({
    ...audienceWhere,
    createdAt: {
      $lte: lastEndDate,
    },
  });

  let audienceCount = 0;
  let audiencePer = 0;

  let followersCount = 0;
  let connectionsCount = 0;
  let bothCount = 0;

  let followersPer = 0;
  let connectionsPer = 0;
  let bothPer = 0;

  let lastAudienceCount = 0;
  let lastFollowersCount = 0;
  let lastConnectionsCount = 0;
  let lastBothCount = 0;

  if (audienceResult?.length > 0) {
    audienceCount =
      audienceResult[0]?.connectionsCount + audienceResult[0]?.followersCount;

    followersCount = audienceResult[0]?.followersCount;
    connectionsCount = audienceResult[0]?.connectionsCount;
  }

  if (lastAudienceResult?.length > 0) {
    lastAudienceCount =
      lastAudienceResult[0]?.connectionsCount +
      lastAudienceResult[0]?.followersCount;

    lastFollowersCount = lastAudienceResult[0]?.followersCount;
    lastConnectionsCount = lastAudienceResult[0]?.connectionsCount;
  }

  bothCount = connectionsCount + followersCount;

  lastBothCount = lastConnectionsCount + lastFollowersCount;

  if (lastAudienceCount > 0) {
    audiencePer =
      ((audienceCount - lastAudienceCount) * 100) / lastAudienceCount;
  }

  if (lastFollowersCount > 0) {
    followersPer =
      ((followersCount - lastFollowersCount) * 100) / lastFollowersCount;
  }

  if (lastConnectionsCount > 0) {
    connectionsPer =
      ((connectionsCount - lastConnectionsCount) * 100) / lastConnectionsCount;
  }

  bothPer = connectionsPer + followersPer;

  // ========================   Engagement =======================

  let engagementWhere = {
    userId: _id,
    pageId: ObjectId(pageId),
  };

  const engagementResult = await getEngagementData({
    ...engagementWhere,
    postTime: {
      $gte: startDate,
      $lte: endDate,
    },
  });

  const lastEngagementResult = await getEngagementData({
    ...engagementWhere,
    postTime: {
      $gte: lastStartDate,
      $lte: lastEndDate,
    },
  });

  let engagementCount = 0;
  let engagementPer = 0;

  let lastEngagementCount = 0;

  let likeCount = 0;
  let commentCount = 0;
  let repostCount = 0;

  let lastLikeCount = 0;
  let lastCommentCount = 0;
  let lastRepostCount = 0;

  let likePer = 0;
  let commentPer = 0;
  let repostPer = 0;

  if (engagementResult?.length > 0) {
    engagementCount =
      engagementResult[0]?.commentCount +
      engagementResult[0]?.likeCount +
      engagementResult[0]?.repostCount;

    likeCount = engagementResult[0]?.likeCount;
    commentCount = engagementResult[0]?.commentCount;
    repostCount = engagementResult[0]?.repostCount;
  }

  if (lastEngagementResult?.length > 0) {
    lastEngagementCount =
      lastEngagementResult[0]?.commentCount +
      lastEngagementResult[0]?.likeCount +
      lastEngagementResult[0]?.repostCount;

    lastLikeCount = lastEngagementResult[0]?.likeCount;
    lastCommentCount = lastEngagementResult[0]?.commentCount;
    lastRepostCount = lastEngagementResult[0]?.repostCount;
  }

  if (lastEngagementCount > 0) {
    engagementPer =
      ((engagementCount - lastEngagementCount) * 100) / lastEngagementCount;
  }
  if (lastLikeCount > 0) {
    likePer = ((likeCount - lastLikeCount) * 100) / lastLikeCount;
  }
  if (lastCommentCount > 0) {
    commentPer = ((commentCount - lastCommentCount) * 100) / lastCommentCount;
  }
  if (lastRepostCount > 0) {
    repostPer = ((repostCount - lastRepostCount) * 100) / lastRepostCount;
  }

  let where = {
    userId: _id,
    isDeleted: false,
    pageId: ObjectId(pageId),
  };

  const campaignCount = await dbService.recordsCount("CampaignModel", where);

  return {
    reach: {
      reachCount: reachCount?.toFixed(0),
      reachPer: reachPer?.toFixed(2),
      uniqueViews: uniqueViews?.toFixed(0),
      uniqueViewsPer: uniqueViewsPer?.toFixed(2),
    },
    audience: {
      audienceCount: audienceCount?.toFixed(0),
      audiencePer: audiencePer?.toFixed(2),
      followersCount: followersCount?.toFixed(0),
      connectionsCount: connectionsCount?.toFixed(0),
      bothCount: bothCount?.toFixed(0),
      followersPer: followersPer?.toFixed(2),
      connectionsPer: connectionsPer?.toFixed(2),
      bothPer: bothPer?.toFixed(2),
    },
    engagement: {
      engagementCount: engagementCount?.toFixed(0),
      engagementPer: engagementPer?.toFixed(2),
      likeCount: likeCount?.toFixed(0),
      commentCount: commentCount?.toFixed(0),
      repostCount: repostCount?.toFixed(0),
      likePer: likePer?.toFixed(2),
      commentPer: commentPer?.toFixed(2),
      repostPer: repostPer?.toFixed(2),
    },
    campaign: {
      campaignCount: campaignCount,
    },
  };
};

export const getReachData = async (where) => {
  let reachAggregate = [
    {
      $match: where,
    },
    {
      $group: {
        _id: "$pageId",
        count: { $sum: "$uniqueViews" },
      },
    },
  ];
  let reachResult = await dbService.aggregateData(
    "LinkedinPostModel",
    reachAggregate
  );

  return reachResult;
};

export const getAudienceData = async (where) => {
  let audienceResult = await dbService.findAllRecords(
    "LinkedinProfileDataModel",
    where,
    {
      _id: 1,
      connectionsCount: 1,
      followersCount: 1,
    },
    {
      createdAt: -1,
    },
    1
  );

  if (!audienceResult?.followersCount || audienceResult?.followersCount == 0) {
    const followerCount = await dbService.recordsCount(
      "LinkedinFollowerModel",
      {
        userId: where?.userId,
        pageId: where?.pageId,
      }
    );
    if (audienceResult?.length > 0) {
      audienceResult[0].followersCount = followerCount;
    }
  }

  return audienceResult;
};

export const getEngagementData = async (where) => {
  let engagementAggregate = [
    {
      $match: where,
    },
    {
      $group: {
        _id: "$pageId",
        commentCount: { $sum: "$commentCount" },
        likeCount: { $sum: "$likeCount" },
        repostCount: { $sum: "$repostCount" },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ];
  let engagementResult = await dbService.aggregateData(
    "LinkedinPostModel",
    engagementAggregate
  );
  return engagementResult;
};
