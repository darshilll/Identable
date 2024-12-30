const moment = require("moment-timezone");
import dbService from "../../utilities/dbService";
import {
  POST_GENERATE_TYPE,
  POST_STATUS,
  POST_MEDIA_TYPE,
} from "../../utilities/constants";
import { genrateVideoRequest } from "../../utilities/aivideoRequest";
const ObjectId = require("mongodb").ObjectID;

export const generateAIVideoOneClick = async (entry) => {
  try {
    let { oneClickObj } = entry;

    const postArray = await dbService.findAllRecords(
      "PostModel",
      {
        userId: oneClickObj?.userId,
        oneClickId: oneClickObj?._id,
        status: POST_STATUS.DRAFT,
        generatedType: POST_GENERATE_TYPE.AI_VIDEO,
      },
      {
        _id: 1,
      }
    );
    for (let i = 0; i < postArray?.length; i++) {
      const postData = postArray[i];

      let response = await genrateVideoRequest({
        url: null,
        topic: postData?.postTopic,
        color: oneClickObj?.color,
        collection: oneClickObj?.videoCollection,
        ratio: oneClickObj?.videoRatio,
        length: oneClickObj?.videoLength,
        voice: oneClickObj?.videoVoice,
      });

      if (!response?.status) {
        console.error("response = ", response);
        await dbService.updateOneRecords(
          "PostModel",
          { _id: postData?._id },
          {
            postError: "Failed to generate video",
            status: POST_STATUS.ERROR,
          }
        );
        continue;
      }

      var insertObj = {
        topic: postData?.postTopic,
        videoColor: oneClickObj?.color,
        videoCollection: oneClickObj?.videoCollection,
        ratio: oneClickObj?.videoRatio,
        length: oneClickObj?.videoLength,
        voice: oneClickObj?.videoVoice,
        oneClickPostId: postData?._id,
        userId: oneClickObj?.userId,
        videoId: response?.data?.video_id,
        renderId: response.data?.render_id,
        createdAt: Date.now(),
        isScheduled: true,
      };

      await dbService.createOneRecord("AIVideoModel", insertObj);

      await dbService.updateOneRecords(
        "PostModel",
        { _id: postData?._id },
        {
          postBody: postData?.postTopic,
          postMedia: "",
          postMediaType: POST_MEDIA_TYPE.AI_VIDEO,
          status: POST_STATUS.SCHEDULED,
        }
      );
    }
  } catch (error) {
    console.error("generatePost error = ", error);
  }
  return "Post Generated";
};
