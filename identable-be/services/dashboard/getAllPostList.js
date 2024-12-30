import dbService from "../../utilities/dbService";
import { pagenationFn } from "../../utilities/pagination";
const ObjectId = require("mongodb").ObjectID;
import { PREVIEW_DATA } from "../../utilities/constants";
export const getAllPostList = async (entry) => {
  let {
    body: {
      page,
      limit,
      pageId,
      sortByy,
      sortMode,
      startDate,
      endDate,
      searchText,
    },
    user: { _id, currentPageId, isDsahboardLoaded },
  } = entry;

  if (!isDsahboardLoaded) {
    _id = ObjectId(PREVIEW_DATA.USER_ID);
    pageId = ObjectId(PREVIEW_DATA.PAGE_ID);
  }

  const { docLimit, noOfDocSkip } = pagenationFn({
    page,
    limit,
  });

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

  let shortBy = {};

  if (sortByy == "date published") {
    shortBy["postTime"] = sortMode;
  } else if (sortByy == "impression") {
    shortBy["impressionCount"] = sortMode;
  } else if (sortByy == "reach") {
    // shortBy["postTime"] = sortMode;
  } else if (sortByy == "likes") {
    shortBy["likeCount"] = sortMode;
  } else if (sortByy == "comments") {
    shortBy["commentCount"] = sortMode;
  } else if (sortByy == "reach") {
    shortBy["analytics.unique_views"] = sortMode;
  } else if (sortByy == "repost") {
    shortBy["repostCount"] = sortMode;
  } else {
    shortBy = {
      postTime: -1,
    };
  }

  if (searchText) {
    const regex = new RegExp(searchText, "i");
    filter = {
      ...filter,
      $or: [
        { text: { $regex: regex } },
        { "postData.postBody": { $regex: regex } },
      ],
    };
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
        carouselTemplate: "$postData.carouselTemplate",
        reach: { $ifNull: ["$analytics.unique_views", 0] },
        isBoosting: "$postData.isBoosting",
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
        data: [
          { $sort: shortBy },
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

  const data = await dbService.aggregateData("LinkedinPostModel", aggregate);

  return {
    items: data[0].items,
    page: page,
    limit: limit,
    count: data[0].pageInfo.count ? data[0].pageInfo.count : 0,
  };
};
