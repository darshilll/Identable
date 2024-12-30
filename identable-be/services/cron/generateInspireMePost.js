import dbService from "../../utilities/dbService";
import { SUBSCRIPTION_STATUS, POST_STATUS } from "../../utilities/constants";
import { generatePost } from "../post/generatePost";
const ObjectId = require("mongodb").ObjectID;

export const generateInspireMePost = async () => {
  let aggregateQuery = [
    {
      $match: {
        isDeleted: false,
        subscriptionStatus: {
          $in: [SUBSCRIPTION_STATUS.ACTIVE, SUBSCRIPTION_STATUS.TRIAL],
        },
      },
    },
    {
      $lookup: {
        from: "inspiremes",
        let: {
          id: "$userId",
        },
        pipeline: [
          {
            $match: {
              isDeleted: false,
              isScheduled: false,
              $expr: {
                $eq: ["$userId", "$$id"],
              },
            },
          },
          {
            $project: {
              _id: 1,
            },
          },
        ],
        as: "inspireMeData",
      },
    },
    {
      $addFields: {
        inspireMeCount: { $size: "$inspireMeData" },
      },
    },
    {
      $match: {
        inspireMeCount: { $lt: 4 },
      },
    },
    {
      $project: {
        userId: 1,
      },
    },
  ];
  const data = await dbService.aggregateData(
    "SubscriptionModel",
    aggregateQuery
  );

  for (let i = 0; i < data?.length; i++) {
    const dataDic = data[i];
    if (dataDic?.userId) {
      await generatePost({ userId: dataDic?.userId, isCron: true });
    }
  }
};
