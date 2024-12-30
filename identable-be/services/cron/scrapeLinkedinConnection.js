const moment = require("moment-timezone");
import dbService from "../../utilities/dbService";
import { SUBSCRIPTION_STATUS, CANCEL_REASON } from "../../utilities/constants";
import { scrapeConnectionsJob } from "../../utilities/jobs/scrapeConnectionsJob";
import { scrapeFollowersJob } from "../../utilities/jobs/scrapeFollowersJob";
import { scrapeCompanyPageFollowersJob } from "../../utilities/jobs/scrapeCompanyPageFollowersJob";

const ObjectId = require("mongodb").ObjectID;

export const scrapeLinkedinConnection = async () => {
  scrapeLinkedinProfileConnectionFollowers(true);
  scrapeLinkedinProfileConnectionFollowers(false);
  scrapeCompanyFollowers();
};

export const scrapeLinkedinProfileConnectionFollowers = async (isFollower) => {
  const targetLocalTime = moment();

  const timeZonesForUser = [];

  const allTimeZones = moment.tz.names();

  allTimeZones.forEach((timeZone) => {
    const currentLocalTime = targetLocalTime.tz(timeZone);

    if (isFollower) {
      if (currentLocalTime.hour() === 9) {
        timeZonesForUser.push(timeZone);
      }
    } else {
      if (currentLocalTime.hour() === 8) {
        timeZonesForUser.push(timeZone);
      }
    }
  });

  let timeZones = timeZonesForUser;

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
        let: {
          userId: "$_id",
        },
        pipeline: [
          {
            $match: {
              type: "profile",
              $expr: {
                $eq: ["$userId", "$$userId"],
              },
            },
          },
          {
            $project: {
              _id: 1,
            },
          },
        ],
        as: "pageData",
      },
    },
    {
      $unwind: { path: "$pageData", preserveNullAndEmptyArrays: true },
    },
    {
      $project: {
        _id: 1,
        cookies: 1,
        userAgent: 1,
        cookiesExpiry: 1,
        proxy: 1,
        linkedinUserData: 1,
        pageId: "$pageData._id",
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
      dataDic?._id
    ) {
      let jobObj = {
        userId: dataDic?._id,
        cookies: dataDic?.cookies,
        cookiesExpiry: dataDic?.cookiesExpiry,
        userAgent: dataDic?.userAgent,
        pageId: dataDic?.pageId,
        proxy: dataDic?.proxy,
      };

      if (isFollower) {
        await scrapeFollowersJob(jobObj);
      } else {
        await scrapeConnectionsJob(jobObj);
      }
    }
  }
};

export const scrapeCompanyFollowers = async () => {
  const targetLocalTime = moment();

  const timeZonesFor5AM = [];

  const allTimeZones = moment.tz.names();

  allTimeZones.forEach((timeZone) => {
    const currentLocalTime = targetLocalTime.tz(timeZone);

    if (currentLocalTime.hour() === 10) {
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
        "pageData.type": "page",
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
      let jobObj = {
        userId: dataDic?._id,
        cookies: dataDic?.cookies,
        cookiesExpiry: dataDic?.cookiesExpiry,
        userAgent: dataDic?.userAgent,
        pageId: dataDic?.pageId,
        proxy: dataDic?.proxy,
        companyUrl: dataDic?.pageUrl,
      };

      await scrapeCompanyPageFollowersJob(jobObj);
    }
  }
};
