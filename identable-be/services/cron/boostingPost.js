import dbService from "../../utilities/dbService";
import { BOOST_STATUS } from "../../utilities/constants";
import { scheduleBoostingPost } from "../../utilities/automationRequest";
const ObjectId = require("mongodb").ObjectID;

export const boostingPost = async () => {
  let aggregateQuery = [
    {
      $match: {
        isBoosted: false,
      },
    },
    {
      $group: {
        _id: "$postId",
        data: {
          $push: {
            postBoostId: "$_id",
          },
        },
      },
    },
    {
      $lookup: {
        from: "posts",
        localField: "_id",
        foreignField: "_id",
        as: "postData",
      },
    },
    {
      $unwind: { path: "$postData", preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: "linkedinpages",
        localField: "postData.pageId",
        foreignField: "_id",
        as: "pageData",
      },
    },
    {
      $unwind: { path: "$pageData", preserveNullAndEmptyArrays: true },
    },
    {
      $project: {
        _id: 1,
        postData: 1,
        pageData: 1,
        postBoostId: {
          $first: "$data.postBoostId",
        },
      },
    },
  ];
  const postBoostData = await dbService.aggregateData(
    "PostBoostStatusModel",
    aggregateQuery
  );

  if (postBoostData?.length > 0) {
    const botArray = await dbService.findAllRecords("BotModel", {
      isCookieValid: true,
      isEnabled: true,
    });

    let botDetails = [];
    for (let i = 0; i < botArray?.length; i++) {
      let botObj = botArray[i];

      botDetails.push({
        proxy: botObj?.proxy,
        cookies: botObj?.cookies,
        cookiesExpiry: botObj?.cookiesExpiry,
        userAgent: botObj?.userAgent,
        _id: botObj?.userId
          ? botObj?.userId?.toString()
          : botObj?._id?.toString(),
      });
    }

    for (let i = 0; i < postBoostData?.length; i++) {
      let postObj = postBoostData[i];

      for (let j = 0; j < botDetails?.length; j++) {
        let botObj = botDetails[j];

        let filterArray = postObj?.postData?.botIds?.filter(
          (val) => val?.toString() == botObj?._id?.toString()
        );
        if (filterArray?.length == 0) {
          botDetails?.splice(j, 1);
          await boostingPostData(postObj, botObj);
          break;
        }
      }
    }
  }
};
export const boostingPostData = async (postBoostData, botData) => {
  let companyUrl = "";

  if (postBoostData?.pageData?.type == "page") {
    companyUrl = postBoostData?.pageData?.url;
  }

  let responseStatus = await scheduleBoostingPost({
    userId: botData?._id,
    cookies: botData?.cookies,
    cookiesExpiry: botData?.cookiesExpiry,
    postUrl: postBoostData?.postData?.postUrl,
    proxy: botData?.proxy,
    postUrl: postBoostData?.postData?.postUrl,
    companyUrl: companyUrl,
    userAgent: botData?.userAgent
  });

  let boostStatus = BOOST_STATUS.BOOSTING;

  if (!responseStatus) {
    boostStatus = BOOST_STATUS.ERROR;
  }

  await dbService.updateOneRecords(
    "PostBoostStatusModel",
    {
      _id: postBoostData?.postBoostId,
    },
    {
      status: boostStatus,
      isBoosted: true,
      botId: botData?._id,
    }
  );

  await dbService.updateOneRecords(
    "PostModel",
    {
      _id: postBoostData?.postData?._id,
    },
    {
      $push: {
        botIds: ObjectId(botData?._id),
      },
    }
  );
};
