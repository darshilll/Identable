import dbService from "../../utilities/dbService";
import { pagenationFn } from "../../utilities/pagination";

export const getUserList = async (entry) => {
  let {
    body: { page, limit, searchText },
    user: { _id },
  } = entry;

  const { docLimit, noOfDocSkip } = pagenationFn({
    page,
    limit,
  });

  let where = {};

  if (searchText) {
    const regex = new RegExp(searchText, "i");

    where = {
      ...where,
      $or: [
        { firstName: { $regex: regex } },
        { lastName: { $regex: regex } },
        { email: { $regex: regex } },
      ],
    };
  }

  let aggregate = [
    {
      $match: where,
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
      $lookup: {
        from: "plans",
        localField: "subscriptionData.planId",
        foreignField: "_id",
        as: "planData",
      },
    },
    {
      $unwind: { path: "$planData", preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: "linkedinpages",
        localField: "_id",
        foreignField: "userId",
        as: "linkedinpages",
      },
    },
    {
      $lookup: {
        from: "linkedinpages",
        let: {
          id: "$_id",
        },
        pipeline: [
          {
            $match: {
              isDeleted: false,
              type: "profile",
              $expr: {
                $eq: ["$userId", "$$id"],
              },
            },
          },
          {
            $project: {
              image: 1,
              name: 1,
            },
          },
        ],
        as: "linkedinpageData",
      },
    },
    {
      $unwind: { path: "$linkedinpageData", preserveNullAndEmptyArrays: true },
    },
    {
      $project: {
        name: { $concat: ["$firstName", " ", "$lastName"] },
        profileImagUrl: "$linkedinpageData.image",
        email: 1,
        createdAt: 1,
        lastActiveDate: 1,
        isAISetting: 1,
        subscriptionStatus: "$subscriptionData.subscriptionStatus",
        planName: "$planData.planName",
        linkedinpages: "$linkedinpages",
      },
    },
    {
      $facet: {
        data: [
          { $sort: { _id: -1 } },
          { $skip: noOfDocSkip },
          { $limit: docLimit },
        ],
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

  const data = await dbService.aggregateData("UserModel", aggregate);

  return {
    items: data[0].items,
    page: page,
    limit: limit,
    count: data[0].pageInfo.count ? data[0].pageInfo.count : 0,
  };
};
