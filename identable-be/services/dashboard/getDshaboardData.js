const moment = require("moment");
import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;

export const getDshaboardData = async (entry) => {
  let {
    body: {},
    user: { _id, currentPageId },
  } = entry;

  const userData = await dbService.findOneRecord(
    "UserModel",
    {
      _id: _id,
    },
    {
      _id: 1,
      isDsahboardLoaded: 1,
    }
  );

  if (!userData?.isDsahboardLoaded) {
    let response = await loadSampleData();
    return response;
  }

  // ============= Last Week Data =============
  let totalAggregate = [
    {
      $match: {
        userId: _id,
        pageId: currentPageId,
      },
    },
    {
      $group: {
        _id: null,
        totalLike: { $sum: "$likeCount" },
        totalComment: { $sum: "$commentCount" },
        totalRepost: { $sum: "$repostCount" },
        totalPost: { $sum: 1 },
      },
    },
  ];
  let totalDataItem = await dbService.aggregateData(
    "LinkedinPostModel",
    totalAggregate
  );
  let totalData = {};
  if (totalDataItem?.length > 0) {
    totalData = totalDataItem[0];
  }

  const now = moment();

  const lastWeekStart = now.clone().subtract(1, "weeks").startOf("week");
  const lastWeekEnd = now.clone().subtract(1, "weeks").endOf("week");

  const lastWeekStartTimestamp = lastWeekStart.valueOf();
  const lastWeekEndTimestamp = lastWeekEnd.valueOf();

  // ============= Last Week Data =============
  let lastWeekAggregate = [
    {
      $match: {
        userId: _id,
        pageId: currentPageId,
        postTime: {
          $gte: lastWeekStartTimestamp,
          $lt: lastWeekEndTimestamp,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalLike: { $sum: "$likeCount" },
        totalComment: { $sum: "$commentCount" },
        totalRepost: { $sum: "$repostCount" },
        totalPost: { $sum: 1 },
      },
    },
  ];
  let lastWeekDataItem = await dbService.aggregateData(
    "LinkedinPostModel",
    lastWeekAggregate
  );
  let lastWeekData = {};
  if (lastWeekDataItem?.length > 0) {
    lastWeekData = lastWeekDataItem[0];
  }

  // ============= Previous Week Data =============

  const previousWeekStart = lastWeekStart
    .clone()
    .subtract(1, "weeks")
    .startOf("week");
  const previousWeekEnd = lastWeekEnd
    .clone()
    .subtract(1, "weeks")
    .endOf("week");

  const previousWeekStartTimestamp = previousWeekStart.valueOf();
  const previousWeekEndTimestamp = previousWeekEnd.valueOf();

  let previousWeekAggregate = [
    {
      $match: {
        userId: _id,
        pageId: currentPageId,
        postTime: {
          $gte: previousWeekStartTimestamp,
          $lt: previousWeekEndTimestamp,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalLike: { $sum: "$likeCount" },
        totalComment: { $sum: "$commentCount" },
        totalRepost: { $sum: "$repostCount" },
        totalPost: { $sum: 1 },
      },
    },
  ];
  let previousWeekDataItem = await dbService.aggregateData(
    "LinkedinPostModel",
    previousWeekAggregate
  );
  let previousWeekData = {};
  if (previousWeekDataItem?.length > 0) {
    previousWeekData = previousWeekDataItem[0];
  }

  //============== Total Followers and Connection ================

  const profileData = await dbService.findOneRecord(
    "LinkedinPageModel",
    {
      _id: currentPageId,
    },
    {
      followersCount: 1,
      connectionsCount: 1,
    }
  );

  const weekTimeData = [];

  // Function to get timestamp and string value for a week
  const getWeekInfo = (start, end) => ({
    weekStartTime: start.valueOf(),
    weekEndTime: end.valueOf(),
    weekVal: `${start.format("MM/DD")} - ${end.format("MM/DD")}`,
  });

  // Get this week's start and end
  const thisWeekStart = now.clone().startOf("week");
  const thisWeekEnd = now.clone().endOf("week");
  weekTimeData.push(getWeekInfo(thisWeekStart, thisWeekEnd));

  // Get the last five weeks
  for (let i = 0; i < 4; i++) {
    const lastWeekStart = now
      .clone()
      .subtract(i + 1, "weeks")
      .startOf("week");
    const lastWeekEnd = now
      .clone()
      .subtract(i + 1, "weeks")
      .endOf("week");
    weekTimeData.push(getWeekInfo(lastWeekStart, lastWeekEnd));
  }

  let postTrend = [];
  for (let i = 0; i < weekTimeData?.length; i++) {
    const weekDic = weekTimeData[i];

    let weekData = await getPostTrend({
      _id,
      currentPageId,
      startDate: weekDic?.weekStartTime,
      endDate: weekDic?.weekEndTime,
    });
    postTrend.push({
      ...weekDic,
      weekData,
    });
  }

  //=============== Get Connection / Followers =================

  let networkTrend = [];
  for (let i = 0; i < weekTimeData?.length; i++) {
    const weekDic = weekTimeData[i];

    let weekData = await getNetworkTrend({
      _id,
      currentPageId,
      startDate: weekDic?.weekStartTime,
      endDate: weekDic?.weekEndTime,
    });

    if (!weekData?.connectionsCount) {
      weekData.connectionsCount = profileData?.connectionsCount;
    }
    if (!weekData?.followersCount) {
      weekData.followersCount = profileData?.followersCount;
    }

    networkTrend.push({
      ...weekDic,
      weekData,
    });
  }

  return {
    totalData,
    lastWeekData,
    previousWeekData,
    followersCount: profileData?.followersCount,
    connectionsCount: profileData?.connectionsCount,
    postTrend,
    isDsahboardLoaded: userData?.isDsahboardLoaded,
    networkTrend: networkTrend,
  };
};

export const getPostTrend = async (entry) => {
  let { _id, startDate, endDate, currentPageId } = entry;

  let aggregate = [
    {
      $match: {
        userId: _id,
        pageId: currentPageId,
        postTime: {
          $gte: startDate,
          $lt: endDate,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalLike: { $sum: "$likeCount" },
        totalComment: { $sum: "$commentCount" },
        totalRepost: { $sum: "$repostCount" },
        totalImpression: { $sum: "$impressionCount" },
      },
    },
  ];
  let weekDataItem = await dbService.aggregateData(
    "LinkedinPostModel",
    aggregate
  );
  let weekData = {};
  if (weekDataItem?.length > 0) {
    weekData = weekDataItem[0];
  }
  return weekData;
};
export const getNetworkTrend = async (entry) => {
  let { _id, startDate, endDate, currentPageId } = entry;

  let aggregate = [
    {
      $match: {
        userId: _id,
        pageId: currentPageId,
        createdAt: {
          $gte: startDate,
          $lt: endDate,
        },
      },
    },
    {
      $group: {
        _id: null,
        connectionsCount: { $avg: "$connectionsCount" },
        followersCount: { $avg: "$followersCount" },
      },
    },
  ];
  let weekDataItem = await dbService.aggregateData(
    "LinkedinProfileDataModel",
    aggregate
  );
  let weekData = {};
  if (weekDataItem?.length > 0) {
    weekData = weekDataItem[0];
  }
  return weekData;
};

export const loadSampleData = async (entry) => {
  const now = moment();

  const weekTimeData = [];

  const getWeekInfo = (start, end) => ({
    weekStartTime: start.valueOf(),
    weekEndTime: end.valueOf(),
    weekVal: `${start.format("MM/DD")} - ${end.format("MM/DD")}`,
  });

  const thisWeekStart = now.clone().startOf("week");
  const thisWeekEnd = now.clone().endOf("week");
  weekTimeData.push(getWeekInfo(thisWeekStart, thisWeekEnd));

  for (let i = 0; i < 4; i++) {
    const lastWeekStart = now
      .clone()
      .subtract(i + 1, "weeks")
      .startOf("week");
    const lastWeekEnd = now
      .clone()
      .subtract(i + 1, "weeks")
      .endOf("week");
    weekTimeData.push(getWeekInfo(lastWeekStart, lastWeekEnd));
  }

  let postTrend = [];
  for (let i = 0; i < weekTimeData?.length; i++) {
    const weekDic = weekTimeData[i];

    let weekData = await getPostTrendSample(i);
    postTrend.push({
      ...weekDic,
      weekData,
    });
  }

  let obj = {
    totalData: {
      _id: null,
      totalLike: 86,
      totalComment: 21,
      totalRepost: 15,
      totalPost: 77,
    },
    lastWeekData: {
      _id: null,
      totalLike: 23,
      totalComment: 6,
      totalRepost: 9,
      totalPost: 15,
    },
    previousWeekData: {
      _id: null,
      totalLike: 8,
      totalComment: 1,
      totalRepost: 0,
      totalPost: 12,
    },
    followersCount: 300,
    connectionsCount: 600,
    postTrend,
  };

  return obj;
};

export const getPostTrendSample = async (i) => {
  let weekData = {};
  if (i == 0) {
    weekData = {
      _id: null,
      totalLike: 20,
      totalComment: 10,
      totalRepost: 5,
      totalImpression: 588,
    };
  } else if (i == 1) {
    weekData = {
      _id: null,
      totalLike: 20,
      totalComment: 10,
      totalRepost: 5,
      totalImpression: 588,
    };
  } else if (i == 2) {
    weekData = {
      _id: null,
      totalLike: 30,
      totalComment: 40,
      totalRepost: 10,
      totalImpression: 700,
    };
  } else if (i == 3) {
    weekData = {
      _id: null,
      totalLike: 30,
      totalComment: 20,
      totalRepost: 1,
      totalImpression: 300,
    };
  } else if (i == 4) {
    weekData = {
      _id: null,
      totalLike: 18,
      totalComment: 15,
      totalRepost: 4,
      totalImpression: 750,
    };
  } else {
    weekData = {
      _id: null,
      totalLike: 5,
      totalComment: 15,
      totalRepost: 5,
      totalImpression: 650,
    };
  }
  return weekData;
};
