import dbService from "../../utilities/dbService";
import { pagenationFn } from "../../utilities/pagination";
const moment = require("moment-timezone");
import { CONNECTION_STATUS } from "../../utilities/constants";

export const getAgeGroup = async (entry) => {
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
      $bucket: {
        groupBy: "$linkedinUserData.age",
        boundaries: [18, 25, 33, 41, 55, 100],
        default: "Other",
        output: {
          count: { $sum: 1 },
          data: {
            $push: {
              _id: "$_id",
            },
          },
        },
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

    if (dataDic?._id == 18) {
      newData.push({
        group: "18-24",
        count: dataDic?.count,
        data: connectionIds,
      });
    } else if (dataDic?._id == 25) {
      newData.push({
        group: "25-32",
        count: dataDic?.count,
        data: connectionIds,
      });
    } else if (dataDic?._id == 33) {
      newData.push({
        group: "33-40",
        count: dataDic?.count,
        data: connectionIds,
      });
    } else if (dataDic?._id == 41) {
      newData.push({
        group: "41-54",
        count: dataDic?.count,
        data: connectionIds,
      });
    } else if (dataDic?._id == 55) {
      newData.push({
        group: "55+",
        count: dataDic?.count,
        data: connectionIds,
      });
    } else {
      newData.push({
        group: "Other",
        count: dataDic?.count,
        data: connectionIds,
      });
    }
  }

  return newData;
};
