import dbService from "../../utilities/dbService";
import { pagenationFn } from "../../utilities/pagination";
const moment = require("moment-timezone");
import { CONNECTION_STATUS } from "../../utilities/constants";

export const getCityGroup = async (entry) => {
  let {
    user: { _id, userTimezone, currentPageId },
  } = entry;

  let where = {
    userId: _id,
    isDeleted: false,
  };

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
      $group: {
        _id: "$linkedinUserData.city",
        count: { $sum: 1 },
        data: {
          $push: {
            _id: "$_id",
          },
        },
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
    {
      $limit: 5,
    },
    {
      $project: {
        _id: 0,
        group: { $ifNull: ["$_id", "Other"] },
        count: "$count",
        data: "$data",
      },
    },
  ];

  const data = await dbService.aggregateData(
    "LinkedinConnectedModel",
    aggregate
  );

  let newData = [];

  for (let i = 0; i < data?.length; i++) {
    const dataDic = data[i];

    let connectionIds = dataDic?.data?.map((obj) => obj?._id);

    newData.push({
      ...dataDic,
      data: connectionIds,
    });
  }

  return newData;
};
