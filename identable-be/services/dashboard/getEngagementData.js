const moment = require("moment");
import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;
import { PREVIEW_DATA } from "../../utilities/constants";
export const getEngagementData = async (entry) => {
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
        postTime: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $addFields: {
        postTimeString: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: { $add: [new Date(0), "$postTime"] },
          },
        },
      },
    },
    {
      $group: {
        _id: "$postTimeString",
        commentCount: { $sum: "$commentCount" },
        likeCount: { $sum: "$likeCount" },
        repostCount: { $sum: "$repostCount" },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ];
  let result = await dbService.aggregateData("LinkedinPostModel", aggregate);

  const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1;
  let type = "";
  if (totalDays >= 360 && totalDays <= 370) {
    type = "year";
  }

  let resultData = [];

  for (let index = 0; index < totalDays - 1; index++) {
    let commentCount = 0;
    let likeCount = 0;
    let repostCount = 0;

    const intervalStartDate = new Date(startDate);
    intervalStartDate.setDate(intervalStartDate.getDate() + index);

    let formattedDate = moment(intervalStartDate).format("YYYY-MM-DD");

    const filterArray = result?.filter((x) => x?._id == formattedDate);

    if (filterArray.length > 0) {
      commentCount = commentCount + filterArray[0]?.commentCount || 0;
      likeCount = likeCount + filterArray[0]?.likeCount || 0;
      repostCount = repostCount + filterArray[0]?.repostCount || 0;
    }

    if (type == "year") {
      const formattedStartDate = moment(intervalStartDate).format("MMM YYYY");

      let resultFilterArray = resultData?.filter(
        (x) => x?.start == formattedStartDate
      );
      if (resultFilterArray?.length > 0) {
        resultFilterArray[0]["commentCount"] =
          Number(resultFilterArray[0]["commentCount"]) + commentCount;
        resultFilterArray[0]["likeCount"] =
          Number(resultFilterArray[0]["likeCount"]) + likeCount;
        resultFilterArray[0]["repostCount"] =
          Number(resultFilterArray[0]["repostCount"]) + repostCount;
      } else {
        resultData.push({
          start: formattedStartDate,
          end: formattedStartDate,
          commentCount: commentCount,
          likeCount: likeCount,
          repostCount: repostCount,
        });
      }
    } else {
      const formattedStartDate = moment(intervalStartDate).format("MMM DD");

      resultData.push({
        start: formattedStartDate,
        end: formattedStartDate,
        commentCount: commentCount,
        likeCount: likeCount,
        repostCount: repostCount,
      });
    }
  }

  return {
    chartData: resultData,
  };
};
