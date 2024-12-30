const moment = require("moment-timezone");
import dbService from "../../../utilities/dbService";
import {
  SUBSCRIPTION_STATUS,
  CONNECTION_STATUS,
  CONNECTION_JOB_TYPE,
} from "../../../utilities/constants";
import { initiateLinkedinConnectionsJob } from "../../../utilities/jobs/crm/initiateLinkedinConnectionsJob";
import { generateConnectionNotePrompt } from "../../openai/generateConnectionNotePrompt";

const ObjectId = require("mongodb").ObjectID;

export const scheduleInitiateConnection = async (entry) => {
  await updateCampaignProcessingStatus();

  const targetLocalTime = moment();

  const timeZonesForJob = [];

  const allTimeZones = moment.tz.names();

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
      timeZonesForJob.push(timeZone);
    }
  });

  let timeZones = timeZonesForJob;

  let where = {
    subscriptionStatus: {
      $in: [SUBSCRIPTION_STATUS.ACTIVE, SUBSCRIPTION_STATUS.TRIAL],
    },
  };

  let userWhere = {
    "userData.isDeleted": false,
    "userData.isCookieValid": true,
  };
  if (entry?.userId) {
    where = {
      ...where,
      userId: ObjectId(entry?.userId),
    };
  } else {
    userWhere = {
      ...userWhere,
      "userData.timezone": { $in: timeZones },
    };
  }
  const currentStart = new Date();
  currentStart.setHours(0, 0, 0, 0);

  let maxProspects = 8;

  let condition = {};

  if (entry?.jobType == CONNECTION_JOB_TYPE.INTERACT_WITH_RECENT_POST) {
    condition = {
      ...condition,
      profileVisitingAt: { $lte: currentStart.getTime() },
      $or: [
        { currentStatus: CONNECTION_STATUS.PROFILE_VISITNG },
        { currentStatus: CONNECTION_STATUS.PROFILE_VISITED },
      ],
    };
  } else if (entry?.jobType == CONNECTION_JOB_TYPE.FOLLOW_USER) {
    condition = {
      ...condition,
      commentingAt: { $lte: currentStart.getTime() },
      $or: [
        { currentStatus: CONNECTION_STATUS.COMMENTING },
        { currentStatus: CONNECTION_STATUS.COMMENTED },
      ],
    };
  } else if (entry?.jobType == CONNECTION_JOB_TYPE.SEND_CONNECTION_REQUEST) {
    condition = {
      ...condition,
      followingAt: { $lte: currentStart.getTime() },
      $or: [
        { currentStatus: CONNECTION_STATUS.FOLLOWING },
        { currentStatus: CONNECTION_STATUS.FOLLOWED },
      ],
    };
  } else {
    condition = {
      currentStatus: "",
    };
  }

  let aggregateQuery = [
    {
      $match: where,
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userData",
      },
    },
    {
      $unwind: { path: "$userData", preserveNullAndEmptyArrays: true },
    },
    {
      $match: userWhere,
    },
    {
      $lookup: {
        from: "linkedinpages",
        let: {
          userId: "$userId",
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
              designation: 1,
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
      $lookup: {
        from: "campaigns",
        let: {
          id: "$userId",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$userId", "$$id"],
              },
              isDeleted: false,
              isEnabled: true,
            },
          },
          {
            $lookup: {
              from: "linkedinconnections",
              let: {
                campaignId: "$_id",
              },
              pipeline: [
                {
                  $match: {
                    isLinkedinConnection: false,
                    $expr: {
                      $eq: ["$campaignId", "$$campaignId"],
                    },
                    ...condition,
                  },
                },
                {
                  $limit: maxProspects,
                },
                {
                  $lookup: {
                    from: "linkedinuserdatas",
                    localField: "linkedinUserName",
                    foreignField: "username",
                    as: "linkedinUserData",
                  },
                },
                {
                  $unwind: {
                    path: "$linkedinUserData",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $project: {
                    _id: 1,
                    profileUrl: "$linkedinUserData.profileUrl",
                    name: "$linkedinUserData.name",
                    primarySubTitle: "$linkedinUserData.primarySubTitle",
                  },
                },
              ],
              as: "prospectData",
            },
          },
          {
            $sort: {
              createdAt: 1,
            },
          },
          {
            $project: {
              _id: 1,
              createdAt: 1,
              prospectData: 1,
            },
          },
        ],
        as: "campaignData",
      },
    },
    {
      $project: {
        _id: 1,
        userId: 1,
        cookies: "$userData.cookies",
        userAgent: "$userData.userAgent",
        cookiesExpiry: "$userData.cookiesExpiry",
        proxy: "$userData.proxy",
        chatGPTVersion: "$userData.chatGPTVersion",
        campaignData: 1,
        designation: "$pageData.designation",
      },
    },
  ];

  const data = await dbService.aggregateData(
    "SubscriptionModel",
    aggregateQuery
  );

  let bulkDataArray = [];

  for (let i = 0; i < data?.length; i++) {
    const dataDic = data[i];
    if (
      dataDic?.cookies &&
      dataDic?.userAgent &&
      dataDic?.cookiesExpiry &&
      dataDic?.userId
    ) {
      const campaignData = dataDic?.campaignData;
      if (campaignData?.length > 0) {
        const profilesArray = [];

        const campaignId = campaignData[0]?._id;

        const campaignCreatedDate = campaignData[0]?.createdAt;
        const currentDate = new Date();
        const givenDate = new Date(campaignCreatedDate);
        const daysDifference = daysBetween(currentDate, givenDate);
        if (daysDifference <= 7) {
          if (entry?.jobType == CONNECTION_JOB_TYPE.VISIT_PROFILE) {
            maxProspects = 3;
          } else if (
            entry?.jobType == CONNECTION_JOB_TYPE.SEND_CONNECTION_REQUEST
          ) {
            maxProspects = 1;
          } else {
            maxProspects = 2;
          }
        } else if (daysDifference <= 14) {
          if (entry?.jobType == CONNECTION_JOB_TYPE.SEND_CONNECTION_REQUEST) {
            maxProspects = 2;
          } else {
            maxProspects = 5;
          }
        } else {
          if (entry?.jobType == CONNECTION_JOB_TYPE.SEND_CONNECTION_REQUEST) {
            maxProspects = 3;
          } else {
            maxProspects = 8;
          }
        }

        for (let i = 0; i < maxProspects; i++) {
          for (let campaign of campaignData) {
            if (campaign?.prospectData[i]) {
              const prospectData = campaign.prospectData[i];
              let actionType = entry?.jobType;
              if (actionType == CONNECTION_JOB_TYPE.VISIT_PROFILE) {
                actionType = null;
              }
              let obj = {
                profile_url: prospectData?.profileUrl,
                action_type: actionType,
                prospect_id: prospectData?._id,
                campaign_id: campaign?._id,
              };
              let connectionNote = "";

              if (
                entry?.jobType == CONNECTION_JOB_TYPE.SEND_CONNECTION_REQUEST
              ) {
                // GENERATE CONNECTION REQUEST NOTE
                connectionNote = await generateConnectionNotePrompt({
                  chatGPTVersion: dataDic?.chatGPTVersion,
                  name: prospectData?.name,
                  primarySubTitle: prospectData?.primarySubTitle,
                  designation: dataDic?.designation,
                });
                obj = {
                  ...obj,
                  note: connectionNote ? connectionNote : "",
                };
              }
              profilesArray.push(obj);

              let updateObj = {
                isProfileVisiting: true,
                profileVisitingAt: Date.now(),
                currentStatus: CONNECTION_STATUS.PROFILE_VISITNG,
              };

              if (
                entry?.jobType == CONNECTION_JOB_TYPE.INTERACT_WITH_RECENT_POST
              ) {
                updateObj = {
                  isCommenting: true,
                  commentingAt: Date.now(),
                  currentStatus: CONNECTION_STATUS.COMMENTING,
                };
              } else if (entry?.jobType == CONNECTION_JOB_TYPE.FOLLOW_USER) {
                updateObj = {
                  isFollowing: true,
                  followingAt: Date.now(),
                  currentStatus: CONNECTION_STATUS.FOLLOWING,
                };
              } else if (
                entry?.jobType == CONNECTION_JOB_TYPE.SEND_CONNECTION_REQUEST
              ) {
                updateObj = {
                  isConnecting: true,
                  connectingAt: Date.now(),
                  currentStatus: CONNECTION_STATUS.CONNECTING,
                  note: connectionNote,
                };
              }

              bulkDataArray.push({
                updateOne: {
                  filter: { _id: prospectData?._id },
                  update: {
                    $set: updateObj,
                  },
                },
              });

              if (profilesArray?.length >= maxProspects) {
                break;
              }
            }
          }
          if (profilesArray?.length >= maxProspects) {
            break;
          }
        }
        if (profilesArray?.length > 0) {
          let responseStatus = await initiateLinkedinConnectionsJob({
            userId: dataDic?.userId,
            cookies: dataDic?.cookies,
            cookiesExpiry: dataDic?.cookiesExpiry,
            userAgent: dataDic?.userAgent,
            proxy: dataDic?.proxy,
            pageId: dataDic?.pageId,
            profileArray: profilesArray,
            campaignId: campaignId,
          });
        }
      }
    }
  }

  if (bulkDataArray?.length > 0) {
    await dbService.updateBulkRecords("LinkedinConnectionModel", bulkDataArray);
  }
};

function daysBetween(date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
  return Math.round(Math.abs((date1 - date2) / oneDay));
}

export const updateCampaignProcessingStatus = async () => {
  await dbService.updateManyRecords(
    "CampaignModel",
    {
      isProcessing: true,
    },
    {
      isProcessing: false,
    }
  );
};
