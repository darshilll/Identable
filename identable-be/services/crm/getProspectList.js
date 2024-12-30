import dbService from "../../utilities/dbService";
import { pagenationFn } from "../../utilities/pagination";
import { CONNECTION_STATUS, FOLLOW_STATUS } from "../../utilities/constants";
const ObjectId = require("mongodb").ObjectID;

export const getProspectList = async (entry) => {
  let {
    body: { page, limit, type, searchText, campaignId },
    user: { _id },
  } = entry;

  if (type == "connected" || type == "companyConnected") {
    return await getConnectedList(entry);
  }
  if (type == "companyFollowers") {
    return await getCompanyFollowersList(entry);
  }
  if (type == "companyFollowing" || type == "companyQueue") {
    return await getCompanyFollowingList(entry);
  }

  const { docLimit, noOfDocSkip } = pagenationFn({
    page,
    limit,
  });

  let where = {
    userId: _id,
    isLinkedinConnection: false,
  };

  if (campaignId) {
    where = {
      ...where,
      campaignId: ObjectId(campaignId),
    };
  }

  if (type == "prospecting" || type == "companyProspecting") {
    where = {
      ...where,
      currentStatus: "",
    };
  } else if (type == "warming" || type == "companyWarming") {
    where = {
      ...where,
      currentStatus: {
        $in: [
          CONNECTION_STATUS.COMMENTED,
          CONNECTION_STATUS.COMMENTING,
          CONNECTION_STATUS.PROFILE_VISITED,
          CONNECTION_STATUS.PROFILE_VISITNG,
        ],
      },
    };
  } else if (type == "following") {
    where = {
      ...where,
      currentStatus: {
        $in: [CONNECTION_STATUS.FOLLOWED, CONNECTION_STATUS.FOLLOWING],
      },
    };
  } else if (type == "connecting") {
    where = {
      ...where,
      currentStatus: {
        $in: [CONNECTION_STATUS.CONNECTING, CONNECTION_STATUS.CONNECTED],
      },
    };
  } else if (type == "ignored") {
    where = {
      ...where,
      currentStatus: {
        $in: [CONNECTION_STATUS.IGNORED],
      },
    };
  } else if (type == "dropped") {
    where = {
      ...where,
      currentStatus: {
        $in: [CONNECTION_STATUS.DROPPED],
      },
    };
  }

  let searchWhere = {};

  if (searchText) {
    const regex = new RegExp(searchText, "i");

    searchWhere = {
      $or: [
        { "linkedinUserData.name": { $regex: regex } },
        { "linkedinUserData.primarySubTitle": { $regex: regex } },
        { "linkedinUserData.secondarySubTitle": { $regex: regex } },
        { "campaignData.name": { $regex: regex } },
      ],
    };
  }

  let aggregate = [
    {
      $match: where,
    },
    {
      $lookup: {
        from: "campaigns",
        localField: "campaignId",
        foreignField: "_id",
        as: "campaignData",
      },
    },
    {
      $unwind: { path: "$campaignData", preserveNullAndEmptyArrays: true },
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
      $match: searchWhere,
    },
    {
      $project: {
        name: "$linkedinUserData.name",
        profileUrl: "$linkedinUserData.profileUrl",
        profileImagUrl: "$linkedinUserData.imageSrc",
        primarySubTitle: "$linkedinUserData.primarySubTitle",
        secondarySubTitle: "$linkedinUserData.secondarySubTitle",
        insight: "$linkedinUserData.insight",
        summary: "$linkedinUserData.summary",
        prospectType: 1,
        isPremium: "$linkedinUserData.isPremium",
        email: "$linkedinUserData.email",
        enrowEmail: "$linkedinUserData.enrowEmail",
        enrowEmailStatus: "$linkedinUserData.enrowEmailStatus",
        campaignName: "$campaignData.campaignName",
        companyName: "$linkedinUserData.companyName",
      },
    },
    {
      $facet: {
        data: [{ $skip: noOfDocSkip }, { $limit: docLimit }],
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

  const data = await dbService.aggregateData(
    "LinkedinConnectionModel",
    aggregate
  );

  return {
    items: data[0].items,
    page: page,
    limit: limit,
    count: data[0].pageInfo.count ? data[0].pageInfo.count : 0,
  };
};

export const getConnectedList = async (entry) => {
  let {
    body: { page, limit, type, searchText, campaignId },
    user: { _id },
  } = entry;

  const { docLimit, noOfDocSkip } = pagenationFn({
    page,
    limit,
  });

  let where = {
    userId: _id,
    isDeleted: false,
  };

  if (campaignId) {
    where = {
      ...where,
      campaignId: ObjectId(campaignId),
    };
  }

  if (type == "companyConnected") {
    let campaignData = await dbService.findAllRecords(
      "CampaignModel",
      {
        userId: _id,
        isCompanyCampaign: true,
      },
      {
        _id: 1,
      }
    );

    let campaignIds = campaignData?.map((obj) => obj?._id);
    where = {
      ...where,
      campaignId: { $in: campaignIds },
    };
  }

  if (searchText) {
    const regex = new RegExp(searchText, "i");

    where = {
      ...where,
      $or: [{ name: { $regex: regex } }, { occupation: { $regex: regex } }],
    };
  }

  let aggregate = [
    {
      $match: where,
    },
    { $skip: noOfDocSkip },
    { $limit: docLimit },
    {
      $lookup: {
        from: "campaigns",
        let: {
          campaignId: "$campaignId",
        },
        pipeline: [
          {
            $match: {
              isDeleted: false,
              $expr: {
                $and: [
                  {
                    $eq: ["$_id", "$$campaignId"],
                  },
                ],
              },
            },
          },
          {
            $project: {
              _id: 1,
              campaignName: 1,
            },
          },
        ],
        as: "campaignData",
      },
    },
    {
      $unwind: {
        path: "$campaignData",
        preserveNullAndEmptyArrays: true,
      },
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
      $project: {
        name: "$linkedinUserData.name",
        profileUrl: "$linkedinUserData.profileUrl",
        profileImagUrl: "$linkedinUserData.imageSrc",
        primarySubTitle: "$linkedinUserData.occupation",
        secondarySubTitle: "N/A",
        insight: "N/A",
        summary: "N/A",
        prospectType: "1st",
        isPremium: "N/A",
        campaignName: {
          $ifNull: ["$campaignData.campaignName", "LinkedIn Connection"],
        },
        isConnected: {
          $cond: {
            if: { $ifNull: ["$campaignData.campaignName", false] },
            then: true,
            else: false,
          },
        },
        email: "$linkedinUserData.email",
        enrowEmail: "$linkedinUserData.enrowEmail",
        enrowEmailStatus: "$linkedinUserData.enrowEmailStatus",
        companyName: "$linkedinUserData.companyName",
      },
    },
  ];

  const data = await dbService.aggregateData(
    "LinkedinConnectedModel",
    aggregate
  );

  const count = await dbService.recordsCount("LinkedinConnectedModel", where);

  return {
    items: data,
    page: page,
    limit: limit,
    count: count,
  };
};

export const getCompanyFollowersList = async (entry) => {
  let {
    body: { page, limit, type, searchText, campaignId },
    user: { _id, currentPageId },
  } = entry;

  const { docLimit, noOfDocSkip } = pagenationFn({
    page,
    limit,
  });

  let where = {
    userId: _id,
    pageId: currentPageId,
  };

  if (campaignId) {
    where = {
      ...where,
      campaignId: ObjectId(campaignId),
    };
  }

  let searchWhere = {};

  if (searchText) {
    const regex = new RegExp(searchText, "i");

    searchWhere = {
      $or: [
        { name: { $regex: regex } },
        { "linkedinUserData.headline": { $regex: regex } },
        { "campaignData.name": { $regex: regex } },
      ],
    };
  }

  let aggregate = [
    {
      $match: where,
    },
    {
      $lookup: {
        from: "campaigns",
        localField: "campaignId",
        foreignField: "_id",
        as: "campaignData",
      },
    },
    {
      $unwind: { path: "$campaignData", preserveNullAndEmptyArrays: true },
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
      $match: searchWhere,
    },
    {
      $project: {
        name: "$linkedinUserData.name",
        profileUrl: "$linkedinUserData.profileUrl",
        imageSrc: "$linkedinUserData.imageSrc",
        headline: "$linkedinUserData.headline",
        email: "$linkedinUserData.email",
        enrowEmailStatus: "$linkedinUserData.enrowEmailStatus",
        campaignName: {
          $ifNull: ["$campaignData.campaignName", "LinkedIn Follower"],
        },
        isFollowed: {
          $cond: {
            if: { $ifNull: ["$campaignData.campaignName", false] },
            then: true,
            else: false,
          },
        },
        companyName: "$linkedinUserData.companyName",
        enrowEmail: "$linkedinUserData.enrowEmail",
      },
    },
    {
      $facet: {
        data: [{ $skip: noOfDocSkip }, { $limit: docLimit }],
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

  const data = await dbService.aggregateData(
    "LinkedinFollowerModel",
    aggregate
  );

  return {
    items: data[0].items,
    page: page,
    limit: limit,
    count: data[0].pageInfo.count ? data[0].pageInfo.count : 0,
  };
};

export const getCompanyFollowingList = async (entry) => {
  let {
    body: { page, limit, type, searchText, campaignId },
    user: { _id, currentPageId },
  } = entry;

  const { docLimit, noOfDocSkip } = pagenationFn({
    page,
    limit,
  });

  let where = {
    userId: _id,
    pageId: currentPageId,
    isFollowed: false,
  };

  if (type == "companyQueue") {
    where = {
      ...where,
      currentStatus: FOLLOW_STATUS.QUEUE,
    };
  } else if (type == "companyFollowing") {
    where = {
      ...where,
      currentStatus: FOLLOW_STATUS.SENT,
    };
  }

  if (campaignId) {
    where = {
      ...where,
      campaignId: ObjectId(campaignId),
    };
  }

  let searchWhere = {};

  if (searchText) {
    const regex = new RegExp(searchText, "i");

    searchWhere = {
      $or: [
        { name: { $regex: regex } },
        { headline: { $regex: regex } },
        { "campaignData.name": { $regex: regex } },
      ],
    };
  }

  let aggregate = [
    {
      $match: where,
    },
    {
      $lookup: {
        from: "campaigns",
        localField: "campaignId",
        foreignField: "_id",
        as: "campaignData",
      },
    },
    {
      $unwind: { path: "$campaignData", preserveNullAndEmptyArrays: true },
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
      $match: searchWhere,
    },
    {
      $project: {
        name: "$linkedinUserData.name",
        profileUrl: "$linkedinUserData.profileUrl",
        imageSrc: "$linkedinUserData.imageSrc",
        occupation: "$linkedinUserData.occupation",
        email: "$linkedinUserData.email",
        enrowEmailStatus: "$linkedinUserData.enrowEmailStatus",
        email: "$linkedinUserData.email",
        linkedinConnectedId: 1,
        campaignName: "$campaignData.campaignName",
        companyName: "$linkedinUserData.companyName",
        enrowEmail: "$linkedinUserData.enrowEmail",
      },
    },
    {
      $facet: {
        data: [{ $skip: noOfDocSkip }, { $limit: docLimit }],
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

  const data = await dbService.aggregateData(
    "LinkedinFollowingModel",
    aggregate
  );

  return {
    items: data[0].items,
    page: page,
    limit: limit,
    count: data[0].pageInfo.count ? data[0].pageInfo.count : 0,
  };
};
