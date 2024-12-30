const moment = require("moment-timezone");
import dbService from "../../utilities/dbService";
import { SUBSCRIPTION_STATUS, CANCEL_REASON } from "../../utilities/constants";
import { scrapeSocialSellingIndexJob } from "../../utilities/jobs/scrapeSocialSellingIndexJob";
const ObjectId = require("mongodb").ObjectID;

export const scrapeSocialSellingIndex = async () => {
  const targetLocalTime = moment();

  const timeZonesFor5AM = [];

  const allTimeZones = moment.tz.names();

  allTimeZones.forEach((timeZone) => {
    const currentLocalTime = targetLocalTime.tz(timeZone);

    if (currentLocalTime.hour() === 8) {
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
        "pageData.type": "profile",
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
      };
      
      await scrapeSocialSellingIndexJob(jobObj);
    }
  }
};
