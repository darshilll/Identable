import dbService from "../../utilities/dbService";
import { pagenationFn } from "../../utilities/pagination";
import { CONNECTION_STATUS, FOLLOW_STATUS } from "../../utilities/constants";
const ObjectId = require("mongodb").ObjectID;

export const getMediaList = async (entry) => {
  let {
    body: { page, limit, mediaType },
    user: { _id, currentPageId },
  } = entry;

  const { docLimit, noOfDocSkip } = pagenationFn({
    page,
    limit,
  });

  let where = {
    userId: _id,
    pageId: currentPageId,
  };

  if (mediaType == "image") {
    where = {
      ...where,
      mimetype: { $in: ["image/jpeg", "image/jpg", "image/png"] },
    };
  }

  let aggregate = [
    {
      $match: where,
    },
    {
      $project: {
        mediaUrl: 1,
        mimetype: 1,
        mediaSize: 1,
      },
    },
    {
      $facet: {
        data: [{ $skip: noOfDocSkip }, { $limit: docLimit }],
        pageInfo: [
          {
            $group: { _id: null, count: { $sum: 1 } },
          },
        ],
      },
    },
    {
      $unwind: { path: "$pageInfo", preserveNullAndEmptyArrays: true },
    },
    {
      $project: {
        items: "$data",
        pageInfo: {
          page: page,
          limit: limit,
          count: "$pageInfo.count",
        },
      },
    },
  ];

  const data = await dbService.aggregateData("MediaModel", aggregate);

  return {
    items: data[0].items,
    page: page,
    limit: limit,
    count: data[0].pageInfo.count ? data[0].pageInfo.count : 0,
  };
};
