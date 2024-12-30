const moment = require("moment-timezone");
import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;

export const savePostAnalyticsData = async (entry) => {
  let {
    body: { postAnalyticsData, userId, pageId },
  } = entry;

  const userData = await dbService.findOneRecord(
    "UserModel",
    {
      _id: ObjectId(userId),
    },
    {
      _id: 1,
      cookies: 1,
      cookiesExpiry: 1,
      userAgent: 1,
      proxy: 1,
    }
  );

  if (!userData) {
    throw new Error("User not found");
  }

  const postIds = postAnalyticsData.map((post) => post.postId);

  // Call `scrapePostAnalyticsJob` with necessary details and postIds
  const jobResult = await scrapePostAnalyticsJob({
    userId: userData?._id,
    cookies: userData?.cookies,
    cookiesExpiry: userData?.cookiesExpiry,
    userAgent: userData?.userAgent,
    pageId: ObjectId(pageId),
    proxy: userData?.proxy,
    postIds: postIds, // Include postIds
  });

  if (!jobResult) {
    throw new Error("Failed to scrape post analytics data");
  }

  let bulkDataArray = [];

  for (let i = 0; i < jobResult?.length; i++) {
    const postDic = jobResult[i];

    let doc = {
      analytics: postDic?.analytics,
      isScappedAnalytics: true,
      uniqueViews: extractNumber(postDic?.analytics?.unique_views),
    };

    bulkDataArray.push({
      updateOne: {
        filter: { postId: postDic?.postId },
        update: { $set: doc },
        upsert: true,
      },
    });
  }
  
  if (bulkDataArray?.length > 0) {
    await dbService.updateBulkRecords("LinkedinPostModel", bulkDataArray);
  }

  // ================== UPDATE REACH COUNT ==================

  let aggregate = [
    {
      $match: {
        userId: userData?._id,
        pageId: ObjectId(pageId),
      },
    },
    {
      $group: {
        _id: "$pageId",
        count: {
          $sum: "$uniqueViews",
        },
      },
    },
  ];

  const postReachData = await dbService.aggregateData(
    "LinkedinPostModel",
    aggregate
  );

  let postReachcount = 0;
  if (postReachData?.length > 0) {
    postReachcount = postReachData[0]?.count;
  }

  const profileData = await dbService.findAllRecords(
    "LinkedinProfileDataModel",
    {
      userId: userData?._id,
      pageId: ObjectId(pageId),
    },
    {
      postReachcount: 1,
    },
    {
      _id: -1,
    },
    1
  );

  if (profileData?.length > 0) {
    if (profileData[0]?.postReachcount > postReachcount) {
      postReachcount = profileData[0]?.postReachcount;
    }
  }

  let createdAt = moment
    .tz(new Date(), userData?.timezone)
    .startOf("day")
    .valueOf();

  const createdAtString = moment().tz(userData?.timezone).format("YYYY-MM-DD");

  await dbService.updateOneRecords(
    "LinkedinProfileDataModel",
    {
      userId: userData?._id,
      pageId: ObjectId(pageId),
      createdAtString: createdAtString,
    },
    {
      $set: {
        userId: userData?._id,
        pageId: ObjectId(pageId),
        postReachcount: postReachcount,
        createdAtString: createdAtString,
        createdAt: createdAt,
      },
    },
    { upsert: true }
  );

  return "Linkedin post analytics data saved successfully";
};
function extractNumber(value) {
  if (value === null || value === undefined || value === "") {
    return 0;
  }

  try {
    const numericValue = value?.toString()?.replace(/[^0-9.]/g, "");
    const parsedValue = parseInt(numericValue);
    if (!isNaN(parsedValue)) {
      return parsedValue;
    } else {
      return 0;
    }
  } catch (error) {
    return 0;
  }
}
