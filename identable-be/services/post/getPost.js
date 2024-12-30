import dbService from "../../utilities/dbService";
import { POST_STATUS } from "../../utilities/constants";
const ObjectId = require("mongodb").ObjectID;

export const getPost = async (entry) => {
  let {
    body: { startDate, endDate, status },
    user: { _id, currentPageId },
  } = entry;

  let where = {
    userId: _id,
    pageId: currentPageId,
    scheduleDateTime: {
      $gte: startDate,
      $lte: endDate,
    },
  };

  if (
    status == POST_STATUS.POSTED ||
    status == POST_STATUS.SCHEDULED ||
    status == POST_STATUS.DRAFT ||
    status == POST_STATUS.ERROR
  ) {
    where = {
      ...where,
      status: status,
    };
  }

  let aggregate = [
    { $match: where },
    {
      $group: {
        _id: {
          day: {
            $dayOfMonth: {
              date: { $add: [new Date(0), "$scheduleDateTime"] },
            },
          },
        },
        data: {
          $push: {
            scheduleDateTime: "$scheduleDateTime",
            postBody: "$postBody",
            timeSlot: "$timeSlot",
            timePeriod: "$timePeriod",
            postMedia: "$postMedia",
            postMediaType: "$postMediaType",
            generatedType: "$generatedType",
            articleHeadline: "$articleHeadline",
            articleTitle: "$articleTitle",
            pageId: "$pageId",
            status: "$status",
            _id: "$_id",
            isBoosting: "$isBoosting",
            carouselTemplate: "$carouselTemplate",
            documentDescription: "$documentDescription",
            articleId: "$articleId",
          },
        },
      },
    },
    { $sort: { "_id.day": 1 } },
    {
      $project: {
        _id: 0,
        day: "$_id.day",
        data: "$data",
      },
    },
  ];

  let data = await dbService.aggregateData("PostModel", aggregate);
  if (!data) {
    data = [];
  }

  return data;
};
