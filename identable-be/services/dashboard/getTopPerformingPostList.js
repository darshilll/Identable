import dbService from "../../utilities/dbService";
import { pagenationFn } from "../../utilities/pagination";
const ObjectId = require("mongodb").ObjectID;
import { PREVIEW_DATA } from "../../utilities/constants";

export const getTopPerformingPostList = async (entry) => {
  let {
    body: { pageId, startDate, endDate },
    user: { _id, currentPageId, isDsahboardLoaded },
  } = entry;

  if (!isDsahboardLoaded) {
    _id = ObjectId(PREVIEW_DATA.USER_ID);
    pageId = ObjectId(PREVIEW_DATA.PAGE_ID);
  }

  let filter = {
    userId: ObjectId(_id),
    pageId: ObjectId(pageId),
  };

  if (startDate && endDate) {
    filter.postTime = {};
    filter.postTime.$gte = startDate;
    filter.postTime.$lt = endDate;
  } else if (startDate) {
    filter.postTime = {};
    filter.postTime.$gte = startDate;
  } else if (endDate) {
    filter.postTime = {};
    filter.postTime.$lt = endDate;
  }

  let aggregate = [
    {
      $match: filter,
    },
    {
      $lookup: {
        from: "posts",
        localField: "postId",
        foreignField: "linkedinPostId",
        as: "postData",
      },
    },
    {
      $unwind: { path: "$postData", preserveNullAndEmptyArrays: true },
    },
    {
      $project: {
        text: 1,
        mediaUrls: 1,
        article: 1,
        postType: 1,
        postTime: 1,
        postId: "$postData._id",
        likeCount: 1,
        commentCount: 1,
        repostCount: 1,
        impressionCount: 1,
        isBoosting: "$postData.isBoosting",
        carouselTemplate: "$postData.carouselTemplate",
        isIdentable: {
          $cond: {
            if: { $ifNull: ["$postData._id", false] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $facet: {
        data: [{ $sort: { impressionCount: -1 } }, { $limit: 3 }],
      },
    },
    {
      $project: {
        items: "$data",
      },
    },
  ];

  const data = await dbService.aggregateData("LinkedinPostModel", aggregate);

  return {
    data: data[0].items,
  };
};
