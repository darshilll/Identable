import dbService from "../../utilities/dbService";
import { POST_STATUS } from "../../utilities/constants";
const ObjectId = require("mongodb").ObjectID;

export const getOneClickCampaignList = async (entry) => {
  let {
    body: {},
    user: { _id, userTimezone, currentPageId },
  } = entry;

  let where = {
    userId: _id,
    isDeleted: false,
    pageId: currentPageId,
  };

  // const data = await dbService.findAllRecords("OneClickModel", where, {
  //   goal: 1,
  //   _id: 1,
  //   status: 1,
  //   topic: 1,
  //   createdAt: 1,
  //   campaignProgress: 1,
  //   isBoostCampaign: 1,
  // });

  let aggregate = [
    {
      $match: where,
    },
    {
      $lookup: {
        from: "posts",
        let: {
          id: "$_id",
        },
        pipeline: [
          {
            $match: {
              isDeleted: false,
              userId: _id,
              pageId: currentPageId,
              $expr: {
                $eq: ["$oneClickId", "$$id"],
              },
            },
          },
          {
            $project: {
              status: 1,
            },
          },
        ],
        as: "postData",
      },
    },
    {
      $project: {
        goal: 1,
        _id: 1,
        status: 1,
        topic: 1,
        createdAt: 1,
        campaignProgress: 1,
        isBoostCampaign: 1,
        postData:1,
      },
    },
  ];

  let data = await dbService.aggregateData("OneClickModel", aggregate);

  if (!data) {
    data = [];
  }

  for (let i = 0; i < data?.length; i++) {
    let item = data[i];
    const filterArray = item?.postData?.filter(
      (x) => x?.status != POST_STATUS.DRAFT
    );
    let campaignProgress = (100 * filterArray?.length) / item?.postData?.length;
    item["campaignProgress"] = campaignProgress;
  }

  return data;
};
