import dbService from "../../utilities/dbService";
import {
  SUBSCRIPTION_STATUS,
  POST_STATUS,
  POST_GENERATE_TYPE,
  POST_BOOST_STATUS,
} from "../../utilities/constants";
import {
  schedulePostData,
  scheduleArticleData,
} from "../../utilities/automationRequest";
const ObjectId = require("mongodb").ObjectID;
export const processBoostingPost = async () => {
  let aggregateQuery = [
    {
      $match: {
        isDeleted: false,
        status: POST_STATUS.POSTED,
        isBoosting: true,
        boostStatus: POST_BOOST_STATUS.SCHEDULED,
        postUrl: { $exists: true, $ne: "" },
      },
    },
    {
      $project: {
        _id: 1,
        likeCount: 1,
        userId: 1,
      },
    },
  ];
  const data = await dbService.aggregateData("PostModel", aggregateQuery);

  let bulkDataArray = [];

  for (let i = 0; i < data?.length; i++) {
    const dataDic = data[i];

    for (let j = 0; j < dataDic?.likeCount; j++) {
      let doc = {
        userId: dataDic?.userId,
        postId: dataDic?._id,
        createdAt: Date.now(),
      };

      bulkDataArray.push({
        insertOne: {
          document: doc,
        },
      });
    }
  }

  if (bulkDataArray?.length > 0) {
    await dbService.updateBulkRecords("PostBoostStatusModel", bulkDataArray);
  }

  let postIds = data?.map((obj) => obj?._id);

  await dbService.updateManyRecords(
    "PostModel",
    {
      _id: { $in: postIds },
    },
    {
      boostStatus: POST_BOOST_STATUS.PROCESSING,
    }
  );
};
