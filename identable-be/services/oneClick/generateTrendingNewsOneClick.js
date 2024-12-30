const moment = require("moment-timezone");
import dbService from "../../utilities/dbService";
import {
  POST_GENERATE_TYPE,
  POST_STATUS,
  POST_MEDIA_TYPE,
} from "../../utilities/constants";
import { getNews } from "../../utilities/news";
import { generateNewsSummaryPrompt } from "../openai/generateNewsSummaryPrompt";
const ObjectId = require("mongodb").ObjectID;

export const generateTrendingNewsOneClick = async (entry) => {
  try {
    let { oneClickObj } = entry;

    const postArray = await dbService.findAllRecords(
      "PostModel",
      {
        userId: oneClickObj?.userId,
        oneClickId: oneClickObj?._id,
        status: POST_STATUS.DRAFT,
        generatedType: POST_GENERATE_TYPE.TRENDING_NEWS,
      },
      {
        _id: 1,
      }
    );

    const userData = await dbService.findOneRecord(
      "UserModel",
      {
        _id: oneClickObj?.userId,
      },
      {
        chatGPTVersion: 1,
      }
    );

    let newsData = await getNews({
      seatchText: oneClickObj?.topic,
      page: 1,
      pageSize: postArray?.length,
    });

    if (newsData?.articles?.length > 0) {
      for (let i = 0; i < postArray?.length; i++) {
        const postData = postArray[i];

        if (newsData?.articles?.length > i) {
          const newsDic = newsData?.articles[i];

          let result = await generateNewsSummaryPrompt({
            title: newsDic?.title,
            content: newsDic?.content,
            url: newsDic?.url,
            chatGPTVersion: userData?.chatGPTVersion,
          });

          let postObj = {
            postBody: result,
            status: POST_STATUS.SCHEDULED,
          };

          if (newsDic?.urlToImage) {
            postObj = {
              ...postObj,
              postMediaType: "image",
              postMedia: newsDic?.urlToImage,
            };
          }

          await dbService.updateOneRecords(
            "PostModel",
            { _id: postData?._id },
            postObj
          );
        }
      }
    } else {
      let postIds = postArray?.map((obj) => obj?._id);

      await dbService.updateManyRecords(
        "PostModel",
        { _id: { $in: postIds } },
        {
          generatedType: POST_GENERATE_TYPE.INSPIRE_ME,
        }
      );
    }
  } catch (error) {
    console.error("generatePost error = ", error);
  }
  return "Post Generated";
};
