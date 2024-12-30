import dbService from "../../utilities/dbService";
import { pagenationFn } from "../../utilities/pagination";
const moment = require("moment-timezone");
import { CONNECTION_STATUS, PREVIEW_DATA } from "../../utilities/constants";
const ObjectId = require("mongodb").ObjectID;

export const getAgeGenderData = async (entry) => {
  let {
    body: { pageId },
    user: { _id, userTimezone, isDsahboardLoaded },
  } = entry;

  if (!isDsahboardLoaded) {
    _id = ObjectId(PREVIEW_DATA.USER_ID);
    pageId = ObjectId(PREVIEW_DATA.PAGE_ID);
  }

  let currentPageId = ObjectId(pageId);

  let where = {
    userId: _id,
    pageId: currentPageId,
  };

  let connectionData = await getAgeGenderData1(
    { ...where, isDeleted: false },
    "LinkedinConnectedModel"
  );
  let followerData = await getAgeGenderData1(where, "LinkedinFollowerModel");

  let bothTotal = connectionData?.total + followerData?.total;

  let groupArray = ["18-24", "25-32", "33-40", "41-54", "55+", "Unknown"];

  let bothArray = [];

  for (let i = 0; i < groupArray?.length; i++) {
    const group = groupArray[i];

    let menCount = 0;
    let womenCount = 0;
    let otherCount = 0;

    const connectionArray = connectionData?.data?.filter(
      (x) => x?.group == group
    );
    if (connectionArray.length > 0) {
      menCount = connectionArray[0]?.menCount;
      womenCount = connectionArray[0]?.womenCount;
      otherCount = connectionArray[0]?.otherCount;
    }

    const followersArray = followerData?.data?.filter((x) => x?.group == group);
    if (followersArray.length > 0) {
      menCount += followersArray[0]?.menCount;
      womenCount += followersArray[0]?.womenCount;
      otherCount += followersArray[0]?.otherCount;
    }

    let menPer = (menCount * 100) / bothTotal;
    let womenPer = (womenCount * 100) / bothTotal;
    let otherPer = (otherCount * 100) / bothTotal;

    let dic = {
      men: menPer.toFixed(2),
      women: womenPer.toFixed(2),
      other: otherPer.toFixed(2),
      group: group,
      menCount: menCount,
      womenCount: womenCount,
      otherCount: otherCount,
    };
    bothArray.push(dic);
  }

  let bothMenPer = (
    ((connectionData?.menTotal + followerData?.menTotal) * 100) /
    bothTotal
  )?.toFixed(2);
  let bothWomenPer = (
    ((connectionData?.womenTotal + followerData?.womenTotal) * 100) /
    bothTotal
  )?.toFixed(2);
  let bothOtherPer = (
    ((connectionData?.otherTotal + followerData?.otherTotal) * 100) /
    bothTotal
  )?.toFixed(2);

  return {
    connectionTotal: connectionData?.total,
    followerTotal: followerData?.total,
    bothTotal: bothTotal,
    connectionData: connectionData?.data,
    followerData: followerData?.data,
    bothData: bothArray,
    pieChart: {
      connectionData: {
        menPer:
          connectionData?.total > 0
            ? (
                (connectionData?.menTotal * 100) /
                connectionData?.total
              ).toFixed(2)
            : 0,
        womenPer:
          connectionData?.total > 0
            ? (
                (connectionData?.womenTotal * 100) /
                connectionData?.total
              ).toFixed(2)
            : 0,
        otherPer:
          connectionData?.total > 0
            ? (
                (connectionData?.otherTotal * 100) /
                connectionData?.total
              ).toFixed(2)
            : 0,
      },
      followerData: {
        menPer:
          followerData?.total > 0
            ? ((followerData?.menTotal * 100) / followerData?.total).toFixed(2)
            : 0,
        womenPer:
          followerData?.total > 0
            ? ((followerData?.womenTotal * 100) / followerData?.total).toFixed(
                2
              )
            : 0,
        otherPer:
          followerData?.total > 0
            ? ((followerData?.otherTotal * 100) / followerData?.total).toFixed(
                2
              )
            : 0,
      },
      bothData: {
        menPer: bothMenPer,
        womenPer: bothWomenPer,
        otherPer: bothOtherPer,
      },
    },
  };
};

export const getAgeGenderData1 = async (where, modelName) => {
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
      $match: {
        "linkedinUserData.isScrappedAge": true,
      },
    },
    {
      $bucket: {
        groupBy: "$linkedinUserData.age",
        boundaries: [18, 25, 33, 41, 55, 100],
        default: "Unknown",
        output: {
          count: { $sum: 1 },
          genderWise: {
            $push: {
              gender: "$linkedinUserData.gender",
            },
          },
        },
      },
    },
    {
      $unwind: "$genderWise",
    },
    {
      $group: {
        _id: { ageGroup: "$_id", gender: "$genderWise.gender" },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: "$_id.ageGroup",
        genderCounts: {
          $push: {
            gender: "$_id.gender",
            count: "$count",
          },
        },
      },
    },
  ];

  const data = await dbService.aggregateData(modelName, aggregate);

  let connectionData = [];

  let total = 0;
  for (let i = 0; i < data?.length; i++) {
    const dataDic = data[i];
    for (let j = 0; j < dataDic?.genderCounts.length; j++) {
      const element = dataDic?.genderCounts[j];
      total += element?.count;
    }
  }

  let menTotal = 0;
  let womenTotal = 0;
  let otherTotal = 0;

  for (let i = 0; i < data?.length; i++) {
    const dataDic = data[i];

    let menCount = 0;
    let womenCount = 0;
    let otherCount = 0;

    let menPer = 0;
    let womenPer = 0;
    let otherPer = 0;

    for (let j = 0; j < dataDic?.genderCounts.length; j++) {
      const element = dataDic?.genderCounts[j];
      if (element?.gender == "Man") {
        menCount = element?.count;
        menPer = (element?.count * 100) / total;
      } else if (element?.gender == "Woman") {
        womenCount = element?.count;
        womenPer = (element?.count * 100) / total;
      } else {
        otherCount = element?.count;
        otherPer = (element?.count * 100) / total;
      }
    }

    let group = "Unknown";

    if (dataDic?._id == 18) {
      group = "18-24";
    } else if (dataDic?._id == 25) {
      group = "25-32";
    } else if (dataDic?._id == 33) {
      group = "33-40";
    } else if (dataDic?._id == 41) {
      group = "41-54";
    } else if (dataDic?._id == 55) {
      group = "55+";
    }

    let dic = {
      men: menPer.toFixed(2),
      women: womenPer.toFixed(2),
      other: otherPer.toFixed(2),
      group: group,
      menCount: menCount,
      womenCount: womenCount,
      otherCount: otherCount,
    };
    connectionData.push(dic);

    menTotal += menCount;
    womenTotal += womenCount;
    otherTotal += otherCount;
  }

  return {
    data: connectionData,
    total: total,
    menTotal: menTotal,
    womenTotal: womenTotal,
    otherTotal: otherTotal,
  };
};
