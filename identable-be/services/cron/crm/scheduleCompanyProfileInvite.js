const moment = require("moment-timezone");
import dbService from "../../../utilities/dbService";
import {
  SUBSCRIPTION_STATUS,
  FOLLOW_STATUS,
} from "../../../utilities/constants";
import { initiateLinkedinInvitationsJob } from "../../../utilities/jobs/crm/initiateLinkedinInvitationsJob";

const ObjectId = require("mongodb").ObjectID;

export const scheduleCompanyProfileInvite = async () => {
  const targetLocalTime = moment();

  const timeZonesFor5AM = [];

  const allTimeZones = moment.tz.names();

  let startDate = new Date();
  startDate.setDate(startDate.getDate() - 60);

  allTimeZones.forEach((timeZone) => {
    const currentLocalTime = targetLocalTime.tz(timeZone);

    if (currentLocalTime.hour() === 9) {
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
        from: "linkedinfollowings",
        let: {
          pageId: "$pageData._id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$pageId", "$$pageId"],
              },
              currentStatus: FOLLOW_STATUS.QUEUE,
            },
          },
          {
            $limit: 100,
          },
          {
            $project: {
              _id: 1,
              linkedinUserName: 1,
            },
          },
        ],
        as: "linkedinFollowingData",
      },
    },
    {
      $lookup: {
        from: "linkedinuserdatas",
        let: {
          allUsernames: "$linkedinFollowingData.linkedinUserName",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ["$username", "$$allUsernames"],
              },
            },
          },
          {
            $project: {
              _id: 1,
              name: 1,
              username: 1,
            },
          },
        ],
        as: "linkedinUserData",
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
        linkedinUserData: 1,
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
      let prospectArray = [];
      for (let i = 0; i < dataDic?.linkedinUserData?.length; i++) {
        const linkedinUserDic = dataDic?.linkedinUserData[i];
        prospectArray.push({
          name: linkedinUserDic?.name,
          username: linkedinUserDic?.username,
        });
      }

      if (prospectArray?.length > 0) {
        let jobObj = {
          userId: dataDic?._id,
          pageId: dataDic?.pageId,
          cookies: dataDic?.cookies,
          cookiesExpiry: dataDic?.cookiesExpiry,
          userAgent: dataDic?.userAgent,
          proxy: dataDic?.proxy,
          campaignId: null,
          prospectArray: prospectArray,
          companyUrl: dataDic?.pageUrl,
        };

        await initiateLinkedinInvitationsJob(jobObj);
      }
    }
  }
};
