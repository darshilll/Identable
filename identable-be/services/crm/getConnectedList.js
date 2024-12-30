import dbService from "../../utilities/dbService";
import { pagenationFn } from "../../utilities/pagination";
const ObjectId = require("mongodb").ObjectID;

export const getConnectedList = async (entry) => {
  let {
    body: { page, searchText, limit },
    user: { _id, currentPageId },
  } = entry;

  let where = { userId: _id, isDeleted: false };

  if (searchText) {
    const regex = new RegExp(searchText, "i");

    where = {
      ...where,
      name: { $regex: regex },
    };
  }

  const { docLimit, noOfDocSkip } = pagenationFn({
    page,
    limit,
  });

  let aggregate = [
    {
      $match: where,
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
      $unwind: { path: "$linkedinUserData", preserveNullAndEmptyArrays: true },
    },
    {
      $project: {
        name: "$linkedinUserData.name",
        imageSrc: "$linkedinUserData.imageSrc",
        occupation: "$linkedinUserData.occupation",
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

  const data = await dbService.aggregateData(
    "LinkedinConnectedModel",
    aggregate
  );

  return {
    items: data[0].items,
    page: page,
    limit: limit,
    count: data[0].pageInfo.count ? data[0].pageInfo.count : 0,
  };
};
