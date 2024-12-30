import dbService from "../../utilities/dbService";
import { pagenationFn } from "../../utilities/pagination";
const moment = require("moment-timezone");
import { CONNECTION_STATUS } from "../../utilities/constants";
const ObjectId = require("mongodb").ObjectID;
import { PREVIEW_DATA } from "../../utilities/constants";

export const getIndutryData = async (entry) => {
  let {
    body: { pageId },
    user: { _id, userTimezone, isDsahboardLoaded },
  } = entry;

  if (!isDsahboardLoaded) {
    _id = ObjectId(PREVIEW_DATA.USER_ID);
    pageId = ObjectId(PREVIEW_DATA.PAGE_ID);
  }

  let currentPageId = ObjectId(pageId);

  const linkedinConnectedData = await dbService.findAllRecords(
    "LinkedinConnectedModel",
    {
      userId: _id,
      pageId: currentPageId,
      isDeleted: false,
    },
    {
      linkedinUserName: 1,
    }
  );

  let linkedinConnectedUserNameArray = linkedinConnectedData?.map(
    (obj) => obj?.linkedinUserName
  );

  const linkedinFollowersData = await dbService.findAllRecords(
    "LinkedinFollowerModel",
    {
      userId: _id,
      pageId: currentPageId,
    },
    {
      linkedinUserName: 1,
    }
  );

  let linkedinFollowersUserNameArray = linkedinFollowersData?.map(
    (obj) => obj?.linkedinUserName
  );

  let linkedinUserNameArray = [
    ...linkedinConnectedUserNameArray,
    ...linkedinFollowersUserNameArray,
  ];

  let where = {
    username: {
      $in: linkedinUserNameArray,
    },
  };

  let aggregate = [
    {
      $match: where,
    },
    {
      $addFields: {
        ageGroup: {
          $switch: {
            branches: [
              {
                case: {
                  $and: [{ $gte: ["$age", 18] }, { $lte: ["$age", 24] }],
                },
                then: "18-24",
              },
              {
                case: {
                  $and: [{ $gte: ["$age", 25] }, { $lte: ["$age", 32] }],
                },
                then: "25-32",
              },
              {
                case: {
                  $and: [{ $gte: ["$age", 33] }, { $lte: ["$age", 40] }],
                },
                then: "33-40",
              },
              {
                case: {
                  $and: [{ $gte: ["$age", 41] }, { $lte: ["$age", 54] }],
                },
                then: "41-54",
              },
              { case: { $gte: ["$age", 55] }, then: "55+" },
            ],
            default: "Unknown",
          },
        },
      },
    },
    // Stage 2: Group by industry, gender, and age group, then count
    {
      $group: {
        _id: {
          industry: "$industry.industry",
          gender: "$gender",
          ageGroup: "$ageGroup",
        },
        count: { $sum: 1 },
      },
    },
    // Stage 3: Group by industry and gender, and collect age groups
    {
      $group: {
        _id: {
          industry: "$_id.industry",
          gender: "$_id.gender",
        },
        ageGroups: {
          $push: {
            group: "$_id.ageGroup",
            count: "$count",
          },
        },
      },
    },
    // Stage 4: Group by industry and accumulate age groups by gender
    {
      $group: {
        _id: "$_id.industry",
        data: {
          $push: {
            gender: "$_id.gender",
            ageGroups: "$ageGroups",
          },
        },
      },
    },
    // Stage 5: Format output with non-empty ageGroups for each gender
    {
      $project: {
        industryName: "$_id",
        data: {
          $map: {
            input: ["Man", "Woman", "Unknown"],
            as: "gender",
            in: {
              gender: "$$gender",
              age: {
                $ifNull: [
                  {
                    $filter: {
                      input: "$data",
                      as: "entry",
                      cond: { $eq: ["$$entry.gender", "$$gender"] },
                    },
                  },
                  [],
                ],
              },
            },
          },
        },
      },
    },
  ];

  const data = await dbService.aggregateData(
    "LinkedinUserDataModel",
    aggregate
  );

  let newData = [];
  for (let i = 0; i < data?.length; i++) {
    const dataDic = data[i];

    let menData = [];
    let womenData = [];
    let otherData = [];

    let count = 0;

    for (let index = 0; index < dataDic?.data?.length; index++) {
      let innerDataDic = dataDic?.data[index];

      let ageArray = [];
      let count11 = 0;

      for (let j = 0; j < innerDataDic?.age?.length; j++) {
        const ageDic = innerDataDic?.age[j];

        for (let k = 0; k < ageDic?.ageGroups?.length; k++) {
          const ageGroup = ageDic?.ageGroups[k];

          ageArray.push({
            group: ageGroup?.group,
            count: ageGroup?.count,
          });
          count += ageGroup?.count;
        }
      }

      if (innerDataDic?.gender == "Man") {
        menData = ageArray;
      }
      if (innerDataDic?.gender == "Woman") {
        womenData = ageArray;
      }
      if (innerDataDic?.gender == "Unknown") {
        otherData = ageArray;
      }
    }

    if (dataDic?.industryName) {
      let newDic = {
        industryName: dataDic?.industryName,
        menData: menData,
        womenData: womenData,
        otherData: otherData,
        count: count,
      };

      newData.push(newDic);
    }
  }
  if (newData?.length > 10) {
    newData?.sort((a, b) => b?.count - a?.count);
    const firstTenRecords = newData?.slice(0, 10);
    return firstTenRecords;
  }

  return newData;
};
