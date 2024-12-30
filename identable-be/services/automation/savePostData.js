const moment = require("moment-timezone");
import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;
import { postDataEvent } from "../socketEvent/postDataEvent";
import { scrapeConnectionsJob } from "../../utilities/jobs/scrapeConnectionsJob";
import { scrapeCompanyPageFollowersJob } from "../../utilities/jobs/scrapeCompanyPageFollowersJob";
import { scrapeFollowersJob } from "../../utilities/jobs/scrapeFollowersJob";

export const savePostData = async (entry) => {
  let {
    body: { pageId, postData, userId, profileData },
  } = entry;

  const userData = await dbService.findOneRecord("UserModel", {
    _id: ObjectId(userId),
  });

  if (!userData) {
    throw new Error("User not found");
  }

  const linkedinPageData = await dbService.findOneRecord(
    "LinkedinPageModel",
    {
      _id: ObjectId(pageId),
    },
    {
      _id: 1,
      type: 1,
      url: 1,
    }
  );

  if (!linkedinPageData) {
    throw new Error("Page not found");
  }

  let startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  let bulkDataArray = [];

  for (let i = 0; i < postData?.length; i++) {
    const postDic = postData[i];

    let doc = {
      userId: ObjectId(userId),
      pageId: ObjectId(pageId),
      postId: postDic?.postId,
      postUrl: postDic?.postUrl,
      text: postDic?.text,
      image: postDic?.image,
      video: postDic?.video,
      likeCount: extractNumber(postDic?.likeCount),
      commentCount: extractNumber(postDic?.commentCount),
      repostCount: extractNumber(postDic?.repostCount),
      impressionCount: extractNumber(postDic?.impressionCount),
      postTime: postDic?.postTime,
      comments: postDic?.comments,
      createdAt: Date.now(),
      mediaUrls: postDic?.mediaUrls,
      postType: postDic?.postType,
      likeCount1: postDic?.likeCount,
      commentCount1: postDic?.commentCount,
      repostCount1: postDic?.repostCount,
      impressionCount1: postDic?.impressionCount,
      article: postDic?.article,
    };

    if (postDic?.postTime) {
      if (postDic?.postTime > startDate.getTime()) {
        doc = {
          ...doc,
          isScappedAnalytics: false,
        };
      }
    }

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

  postDataEvent({
    userId: userData?._id,
    data: { dataStatus: true },
  });

  await dbService.updateOneRecords(
    "UserModel",
    {
      _id: userData?._id,
    },
    {
      isDsahboardLoaded: true,
    }
  );

  //============= LinkedIn Profile Data ===============

  await dbService.updateOneRecords(
    "LinkedinPageModel",
    { _id: linkedinPageData?._id },
    {
      followersCount: extractNumber(profileData?.followersCount),
      connectionsCount: extractNumber(profileData?.connectionsCount),
    }
  );

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
        followersCount: extractNumber(profileData?.followersCount),
        connectionsCount: extractNumber(profileData?.connectionsCount),
        followersCount1: profileData?.followersCount,
        connectionsCount1: profileData?.connectionsCount,
        createdAtString: createdAtString,
        createdAt: createdAt,
      },
    },
    { upsert: true }
  );

  // ================= SCAPE CONNECTION AND FOLLOWERS =================

  if (linkedinPageData?.type == "profile") {
    let jobObj = {
      userId: userData?._id,
      cookies: userData?.cookies,
      cookiesExpiry: userData?.cookiesExpiry,
      userAgent: userData?.userAgent,
      pageId: pageId,
      proxy: userData?.proxy,
    };

    const connectionCount = await dbService.recordsCount(
      "LinkedinConnectedModel",
      {
        userId: userData?._id,
        pageId: ObjectId(pageId),
        isDeleted: false,
      }
    );

    if (connectionCount >= 50) {
      jobObj = {
        ...jobObj,
        refresh_connections: true,
      };
    }

    await scrapeConnectionsJob(jobObj);
    await scrapeFollowersJob(jobObj);
  } else if (linkedinPageData?.type == "page") {
    let jobObj = {
      userId: userData?._id,
      cookies: userData?.cookies,
      cookiesExpiry: userData?.cookiesExpiry,
      userAgent: userData?.userAgent,
      pageId: pageId,
      proxy: userData?.proxy,
      companyUrl: linkedinPageData?.url,
    };

    const followerCount = await dbService.recordsCount(
      "LinkedinFollowerModel",
      {
        userId: userData?._id,
        pageId: ObjectId(pageId),
      }
    );

    if (followerCount >= 50) {
      jobObj = {
        ...jobObj,
        refresh_followers: true,
      };
    }

    await scrapeCompanyPageFollowersJob(jobObj);
  }

  return "Linkedin post data saved successfully";
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
