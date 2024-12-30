import dbService from "../../utilities/dbService";
import { pagenationFn } from "../../utilities/pagination";

export const getJobRequestList = async (entry) => {
  let {
    body: { page, limit, jobType, status, toDate, fromDate },
    user: { _id },
  } = entry;

  const { docLimit, noOfDocSkip } = pagenationFn({
    page,
    limit,
  });

  let where = {
    status: { $in: ["failed", "processing"] },
  };

  if (jobType) {
    where = {
      ...where,
      "requestData.job_type": jobType,
    };
  }

  if (status) {
    where = {
      ...where,
      status: status,
    };
  }

  if (fromDate) {
    where = {
      ...where,
      submittedAt: { $gte: fromDate },
    };
  }

  if (toDate) {
    where = {
      ...where,
      submittedAt: { $lte: toDate },
    };
  }

  let aggregate = [
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
    { $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "linkedinpages",
        let: {
          id: "$userId",
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
        name: { $concat: ["$userData.firstName", " ", "$userData.lastName"] },
        profileImagUrl: "$linkedinpageData.image",
        requestData: 1,
        submittedAt: 1,
        jobTriggerResponse: 1,
        jobTriggerError: 1,
        jobTriggerResponseAt: 1,
        responseData: 1,
        responseError: 1,
        responseAt: 1,
        status: 1,
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

  const data = await dbService.aggregateData("JobRequestModel", aggregate);

  return {
    items: data[0].items,
    page: page,
    limit: limit,
    count: data[0].pageInfo.count ? data[0].pageInfo.count : 0,
  };
};
