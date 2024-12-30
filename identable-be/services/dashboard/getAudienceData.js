const moment = require("moment");
import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;
import { PREVIEW_DATA } from "../../utilities/constants";
export const getAudienceData = async (entry) => {
  let {
    body: { startDate, endDate, pageId },
    user: { _id, currentPageId, isDsahboardLoaded },
  } = entry;

  if (!isDsahboardLoaded) {
    _id = ObjectId(PREVIEW_DATA.USER_ID);
    pageId = ObjectId(PREVIEW_DATA.PAGE_ID);
  }

  let aggregate = [
    {
      $match: {
        userId: _id,
        pageId: ObjectId(pageId),
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $addFields: {
        createdAtString: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: { $add: [new Date(0), "$createdAt"] },
          },
        },
      },
    },
    {
      $group: {
        _id: "$createdAtString",
        connectionsCount: { $avg: "$connectionsCount" },
        followersCount: { $avg: "$followersCount" },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ];
  let result = await dbService.aggregateData(
    "LinkedinProfileDataModel",
    aggregate
  );

  const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1;
  let type = "";
  if (totalDays >= 360 && totalDays <= 370) {
    type = "year";
  }

  let resultData = [];

  for (let index = 0; index < totalDays - 1; index++) {
    let followersCount = 0;
    let connectionsCount = 0;

    const intervalStartDate = new Date(startDate);
    intervalStartDate.setDate(intervalStartDate.getDate() + index);

    let formattedDate = moment(intervalStartDate).format("YYYY-MM-DD");

    const filterArray = result?.filter((x) => x?._id == formattedDate);

    if (filterArray.length > 0) {
      followersCount = followersCount + filterArray[0]?.followersCount || 0;
      connectionsCount =
        connectionsCount + filterArray[0]?.connectionsCount || 0;
    }

    if (followersCount > 0 || connectionsCount > 0) {
      if (type == "year") {
        const formattedStartDate = moment(intervalStartDate).format("MMM YYYY");

        let resultFilterArray = resultData?.filter(
          (x) => x?.start == formattedStartDate
        );
        if (resultFilterArray?.length > 0) {
          resultFilterArray[0]["followersCount"] = followersCount;
          resultFilterArray[0]["connectionsCount"] = connectionsCount;
        } else {
          resultData.push({
            start: formattedStartDate,
            end: formattedStartDate,
            followersCount: followersCount,
            connectionsCount: connectionsCount,
          });
        }
      } else {
        const formattedStartDate = moment(intervalStartDate).format("MMM DD");

        resultData.push({
          start: formattedStartDate,
          end: formattedStartDate,
          followersCount: followersCount,
          connectionsCount: connectionsCount,
        });
      }
    }
  }
  
  return {
    chartData: resultData,
  };
};
