const moment = require("moment-timezone");
import dbService from "../../utilities/dbService";
import { SUBSCRIPTION_STATUS, CANCEL_REASON } from "../../utilities/constants";
import { scrapeProfileDetailsJob } from "../../utilities/jobs/scrapeProfileDetailsJob";
const ObjectId = require("mongodb").ObjectID;

export const scrapeLinkedinUserDetails = async () => {
  const targetLocalTime = moment();

  const timeZonesForUser = [];

  const allTimeZones = moment.tz.names();

  allTimeZones.forEach((timeZone) => {
    const currentLocalTime = targetLocalTime.tz(timeZone);

    if (
      currentLocalTime.hour() === 8 ||
      currentLocalTime.hour() === 10 ||
      currentLocalTime.hour() === 12 ||
      currentLocalTime.hour() === 14 ||
      currentLocalTime.hour() === 16 ||
      currentLocalTime.hour() === 18 ||
      currentLocalTime.hour() === 20
    ) {
      timeZonesForUser.push(timeZone);
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
        from: "linkedinconnecteds",
        let: {
          id: "$_id",
        },
        pipeline: [
          {
            $match: {
              isScrappedDetails: { $ne: true },
              $expr: {
                $eq: ["$userId", "$$id"],
              },
            },
          },
          {
            $limit: 10,
          },
          {
            $project: {
              _id: 1,
              linkedinUserName: 1,
            },
          },
        ],
        as: "linkedinConnectedData",
      },
    },
    {
      $lookup: {
        from: "linkedinfollowers",
        let: {
          id: "$_id",
        },
        pipeline: [
          {
            $match: {
              isScrappedDetails: { $ne: true },
              $expr: {
                $eq: ["$userId", "$$id"],
              },
            },
          },
          {
            $limit: 10,
          },
          {
            $project: {
              _id: 1,
              linkedinUserName: 1,
            },
          },
        ],
        as: "linkedinFollowerData",
      },
    },
    {
      // Merge the usernames into an array
      $addFields: {
        allUsernames: {
          $setUnion: [
            "$linkedinFollowerData.linkedinUserName",
            "$linkedinConnectedData.linkedinUserName",
          ],
        },
      },
    },
    {
      $lookup: {
        from: "linkedinuserdatas",
        let: {
          allUsernames: "$allUsernames",
        },
        pipeline: [
          {
            $match: {
              isScrappedDetails: { $ne: true },
              $expr: {
                $in: ["$username", "$$allUsernames"],
              },
            },
          },
          {
            $project: {
              _id: 1,
              username: 1,
              profileUrl: 1,
            },
          },
        ],
        as: "linkedinUserData",
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
      let profileArray = [];

      for (let i = 0; i < dataDic?.linkedinUserData?.length; i++) {
        const element = dataDic?.linkedinUserData[i];
        profileArray.push({
          profile_id: element?.profileId,
          username: element?.username,
          profile_url: element?.profileUrl,
        });
      }
      if (profileArray?.length > 0) {
        let jobObj = {
          userId: dataDic?._id,
          cookies: dataDic?.cookies,
          cookiesExpiry: dataDic?.cookiesExpiry,
          userAgent: dataDic?.userAgent,
          pageId: dataDic?.pageId,
          proxy: dataDic?.proxy,
          profileArray: profileArray,
        };

        await scrapeProfileDetailsJob(jobObj);
      }
    }
  }
};
