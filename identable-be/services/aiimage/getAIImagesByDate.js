import dbService from "../../utilities/dbService";
import { getNews } from "../../utilities/news";
import { generatePost } from "../post/generatePost";

const ObjectId = require("mongodb").ObjectID;
import { generateKeywordPrompt } from "../openai/generateKeywordPrompt";

export const getAIImagesByDate = async (entry) => {
  let {
    user: { _id, chatGPTVersion, currentPageId },
  } = entry;

  let where = {
    userId: _id,
    isDeleted: false,
    isEnabled: true,
  };

  let aggregate = [
    { $match: where },
    {
      $addFields: {
        createdAtDate: { $toDate: "$createdAt" },
      },
    },
    {
      $group: {
        _id: {
          dateStr: {
            $dateToString: {
              format: "%d-%m-%Y",
              date: "$createdAtDate",
            },
          },
        },
        latestDate: { $max: "$createdAtDate" },
        data: {
          $push: {
            createdAt: "$createdAt",
            imageUrl: "$imageUrl",
            _id: "$_id",
          },
        },
      },
    },
    { $sort: { latestDate: -1 } },
    {
      $project: {
        _id: 0,
        date: "$_id.dateStr",
        data: {
          $map: {
            input: {
              $sortArray: { input: "$data", sortBy: { createdAt: -1 } },
            },
            as: "item",
            in: "$$item",
          },
        },
      },
    },
  ];

  let data = await dbService.aggregateData("AIImageModel", aggregate);
  if (!data) {
    data = [];
  }

  return data;
};
