const moment = require("moment-timezone");
import dbService from "../../utilities/dbService";
import { POST_GENERATE_TYPE, POST_STATUS } from "../../utilities/constants";
import {
  generateArticleTopicPrompt,
  generateOutlineOutputPrompt,
  generateArticlePrompt,
} from "../openai/generateArticlePrompt";

import { generateAIImageAction } from "../aiimage/generateAIImageAction";

const ObjectId = require("mongodb").ObjectID;

export const generateArticleOneClick = async (entry) => {
  try {
    let { oneClickObj } = entry;

    const postData = await dbService.findAllRecords(
      "PostModel",
      {
        userId: oneClickObj?.userId,
        oneClickId: oneClickObj?._id,
        status: POST_STATUS.DRAFT,
        generatedType: POST_GENERATE_TYPE.ARTICLE,
      },
      {
        postMedia: 1,
        postTopic: 1,
      }
    );

    const settingData = await dbService.findOneRecord("AIAdvanceSettingModel", {
      pageId: oneClickObj?.pageId,
    });

    if (!settingData) {
      return;
    }

    const pageData = await dbService.findOneRecord("LinkedinPageModel", {
      _id: oneClickObj?.pageId,
    });

    for (let index = 0; index < postData?.length; index++) {
      const postDic = postData[index];

      const postTopic = postDic?.postTopic;

      let articleTopicResult = await generateArticleTopicPrompt({
        topic: postTopic,
        userId: oneClickObj?.userId,
        chatGPTVersion: settingData?.chatGPTVersion,
      });

      if (!articleTopicResult?.data) {
        continue;
      }
      let articleTopicList = articleTopicResult?.data;
      if (articleTopicList?.length == 0) {
        continue;
      }

      let selectedTopic = articleTopicList[0];
      if (!selectedTopic) {
        continue;
      }

      let outlineOutputResult = await generateOutlineOutputPrompt({
        title: selectedTopic?.title,
        description: selectedTopic?.description,
        strategicKeywords: selectedTopic?.strategicKeywords,
        searchIntent: selectedTopic?.searchIntent,
        userId: oneClickObj?.userId,
        chatGPTVersion: settingData?.chatGPTVersion,
      });

      if (!outlineOutputResult?.data) {
        continue;
      }
      let outlineOutputList = outlineOutputResult?.data;
      if (outlineOutputList?.length == 0) {
        continue;
      }

      let selectedOutlineOutput = outlineOutputList[0];
      if (!selectedOutlineOutput) {
        continue;
      }
      let articleResult = await generateArticlePrompt({
        title: selectedOutlineOutput?.title,
        headingData: selectedOutlineOutput?.headingdata,
        userId: oneClickObj?.userId,
        chatGPTVersion: settingData?.chatGPTVersion,
        conclusion: outlineOutputResult?.conclusion,
      });
      if (!articleResult) {
        continue;
      }

      let newTopic = selectedTopic;

      let keywords = settingData?.keyword?.map((item) => `${item}`).join(", ");

      let image = await generateAIImageAction({
        topic: newTopic,
        keywords: keywords,
        userId: oneClickObj?.userId,
        pageId: oneClickObj?.pageId,
        size: "1792x1024",
      });

      let postMedia = "";
      if (image) {
        postMedia = image;
      }

      await dbService.updateOneRecords(
        "PostModel",
        { _id: postData[index]?._id },
        {
          articleHeadline: selectedTopic?.title,
          articleTitle: selectedTopic?.title,
          postBody: articleResult,
          postMedia: postMedia,
          postMediaType: "image",
          status: POST_STATUS.SCHEDULED,
        }
      );
    }
  } catch (error) {
    console.error("generateArticleOneClick error = ", error);
  }
  return "Article Generated";
};
