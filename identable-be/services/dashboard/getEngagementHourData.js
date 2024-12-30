import dbService from "../../utilities/dbService";
import { pagenationFn } from "../../utilities/pagination";
const moment = require("moment-timezone");
import { CONNECTION_STATUS } from "../../utilities/constants";
const ObjectId = require("mongodb").ObjectID;
import { PREVIEW_DATA } from "../../utilities/constants";

export const getEngagementHourData = async (entry) => {
  let {
    body: { pageId },
    user: { _id, userTimezone, isDsahboardLoaded },
  } = entry;

  if (!isDsahboardLoaded) {
    _id = ObjectId(PREVIEW_DATA.USER_ID);
    pageId = ObjectId(PREVIEW_DATA.PAGE_ID);
  }

  let where = { userId: _id, pageId: ObjectId(pageId) };

  let aggregate = [
    {
      $match: where,
    },
    {
      $addFields: {
        postDateTimeZone: {
          $dateFromString: {
            dateString: {
              $dateToString: {
                format: "%Y-%m-%dT%H:%M:%S.%L",
                date: { $toDate: "$postTime" },
                timezone: userTimezone,
              },
            },
            timezone: "GMT",
          },
        },
      },
    },
    {
      $addFields: {
        time: {
          $concat: [
            { $toString: { $hour: { $toDate: "$postDateTimeZone" } } },
            ":",
            {
              $cond: {
                if: {
                  $lt: [{ $minute: { $toDate: "$postDateTimeZone" } }, 10],
                },
                then: {
                  $concat: [
                    "0",
                    {
                      $toString: { $minute: { $toDate: "$postDateTimeZone" } },
                    },
                  ],
                },
                else: {
                  $toString: { $minute: { $toDate: "$postDateTimeZone" } },
                },
              },
            },
          ],
        },
      },
    },
    {
      $project: {
        dayOfWeek: { $dayOfWeek: "$postDateTimeZone" },
        hour: "$time",
        uniqueViews: 1,
        impressionCount: 1,
        likeCount: 1,
        commentCount: 1,
        repostCount: 1,
      },
    },
    {
      $group: {
        _id: { dayOfWeek: "$dayOfWeek", hour: "$hour" },
        totalUniqueViews: { $sum: "$uniqueViews" },
        totalImpression: { $sum: "$impressionCount" },
        totalLike: { $sum: "$likeCount" },
        totalComment: { $sum: "$commentCount" },
        totalRepost: { $sum: "$repostCount" },
      },
    },
    {
      $sort: {
        "_id.dayOfWeek": 1,
        totalUniqueViews: -1,
        totalImpression: -1,
        totalLike: -1,
        totalComment: -1,
        totalRepost: -1,
      },
    },
    {
      $group: {
        _id: "$_id.dayOfWeek",
        bestHour: { $first: "$_id.hour" },
        bestUniqueViews: { $first: "$totalUniqueViews" },
        bestImpression: { $first: "$totalImpression" },
        bestLike: { $first: "$totalLike" },
        bestComment: { $first: "$totalComment" },
        bestRepost: { $first: "$totalRepost" },
      },
    },
    {
      $sort: { _id: 1 },
    },
    {
      $project: {
        _id: 0,
        dayOfWeek: "$_id",
        bestHour: 1,
        bestUniqueViews: 1,
        bestImpression: 1,
        bestLike: 1,
        bestComment: 1,
        bestRepost: 1,
      },
    },
  ];

  const data = await dbService.aggregateData("LinkedinPostModel", aggregate);

  return data;
};
