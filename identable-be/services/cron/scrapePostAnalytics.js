const moment = require("moment-timezone");
import dbService from "../../utilities/dbService";
import { SUBSCRIPTION_STATUS, CANCEL_REASON } from "../../utilities/constants";
import { scrapePostAnalyticsJob } from "../../utilities/jobs/scrapePostAnalyticsJob";
const ObjectId = require("mongodb").ObjectID;

export const scrapePostAnalytics = async () => {
  const targetLocalTime = moment();

  const timeZonesFor5AM = [];

  const allTimeZones = moment.tz.names();

  let startDate = new Date();
  startDate.setDate(startDate.getDate() - 60);

  allTimeZones.forEach((timeZone) => {
    const currentLocalTime = targetLocalTime.tz(timeZone);

    if (
      currentLocalTime.hour() === 9 ||
      currentLocalTime.hour() === 11 ||
      currentLocalTime.hour() === 13 ||
      currentLocalTime.hour() === 15 ||
      currentLocalTime.hour() === 17 ||
      currentLocalTime.hour() === 19
    ) {
      timeZonesFor5AM.push(timeZone);
    }
  });

  let timeZones = timeZonesFor5AM;

  let aggregateQuery = [
    {
      $match: {
        isDeleted: false,
        timezone: { $in: timeZones },
        isCookieValid: true,
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "userId",
        as: "subscriptionData",
      },
    },
    {
      $unwind: { path: "$subscriptionData", preserveNullAndEmptyArrays: true },
    },
    {
      $match: {
        "subscriptionData.subscriptionStatus": {
          $in: [SUBSCRIPTION_STATUS.ACTIVE, SUBSCRIPTION_STATUS.TRIAL],
        },
      },
    },
    {
      $lookup: {
        from: "linkedinpages",
        localField: "_id",
        foreignField: "userId",
        as: "pageData",
      },
    },
    {
      $unwind: "$pageData",
    },
    {
      $match: {
        "pageData.isAccess": true,
      },
    },
    {
      $lookup: {
        from: "linkedinposts",
        let: {
          pageId: "$pageData._id",
        },
        pipeline: [
          {
            $match: {
              isScappedAnalytics: { $ne: true },
              $expr: {
                $eq: ["$pageId", "$$pageId"],
              },
              postTime: {
                $gte: startDate.getTime(),
              },
            },
          },
          {
            $sort: {
              postTime: -1,
            },
          },
          {
            $limit: 20,
          },
          {
            $project: {
              _id: 1,
              postId: 1,
            },
          },
        ],
        as: "linkedinPostData",
      },
    },
    {
      $project: {
        _id: 1,
        cookies: 1,
        userAgent: 1,
        cookiesExpiry: 1,
        pageId: "$pageData._id",
        pageType: "$pageData.type",
        pageUrl: "$pageData.url",
        proxy: 1,
        linkedinPostData: 1,
      },
    },
  ];
  const data = await dbService.aggregateData("UserModel", aggregateQuery);
  for (let i = 0; i < data?.length; i++) {
    const dataDic = data[i];
    if (
      dataDic?.cookies &&
      dataDic?.userAgent &&
      dataDic?.cookiesExpiry &&
      dataDic?._id &&
      dataDic?.pageId
    ) {
      let postIds = [];

      for (let i = 0; i < dataDic?.linkedinPostData?.length; i++) {
        const element = dataDic?.linkedinPostData[i];
        postIds.push(element?.postId);
      }
      if (postIds?.length > 0) {
        let jobObj = {
          userId: dataDic?._id,
          cookies: dataDic?.cookies,
          cookiesExpiry: dataDic?.cookiesExpiry,
          userAgent: dataDic?.userAgent,
          pageId: dataDic?.pageId,
          proxy: dataDic?.proxy,
          postIds: postIds,
        };

        await scrapePostAnalyticsJob(jobObj);
      }
    }
  }
};
