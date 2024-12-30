const moment = require("moment-timezone");
import dbService from "../../utilities/dbService";
import { POST_GENERATE_TYPE, POST_STATUS } from "../../utilities/constants";
import { generatePostPrompt } from "../openai/generatePostPrompt";
import { generateGiphy } from "../../utilities/generateGiphy";
import { generatePexelImage } from "../../utilities/generatePexelImage";
import { generatePostTopicPrompt } from "../openai/generatePostTopicPrompt";
const ObjectId = require("mongodb").ObjectID;

export const generateInspireMeOneClick = async (entry) => {
  try {
    let { oneClickObj } = entry;

    const postData = await dbService.findAllRecords(
      "PostModel",
      {
        userId: oneClickObj?.userId,
        oneClickId: oneClickObj?._id,
        status: POST_STATUS.DRAFT,
        generatedType: POST_GENERATE_TYPE.INSPIRE_ME,
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

    let postImage = postData?.map((obj) => obj?.postMedia);
    let usedImageArray = [];

    for (let index = 0; index < postData?.length; index++) {
      // const postTopic = await generatePostTopicPrompt({
      //   settingData,
      //   pageData,
      //   customTopic: oneClickObj?.topic,
      // });

      const postDic = postData[index];

      const postTopic = postDic?.postTopic;

      const postContent = await generatePostPrompt({
        settingData,
        pageData,
        customTopic: postTopic,
      });

      if (!postContent) {
        continue;
      }

      if (postImage?.length > 0) {
        usedImageArray = [...postImage, ...usedImageArray];
      }

      let keywordArray = settingData?.keyword || [];
      keywordArray.push(postTopic?.substring(0, 20));
      let searchText = getRandomSearchText(keywordArray);

      // Generate Giphy Image
      let giphyImageUrl = "";

      let giphyImageArray = await generateGiphy({
        searchText: searchText,
      });

      if (giphyImageArray?.length > 0) {
        giphyImageUrl = giphyImageArray[0];

        let filterArray = giphyImageArray?.filter(
          (val) => !usedImageArray.includes(val)
        );

        if (filterArray?.length > 0) {
          giphyImageUrl = filterArray[0];
        }
        giphyImageUrl = extractImageURL(giphyImageUrl);
        usedImageArray.push(giphyImageUrl);
      }

      // Generate Pexel Image
      let pexelImageUrl = "";

      let pexelImageArray = await generatePexelImage({
        searchText: searchText,
      });

      if (pexelImageArray?.length > 0) {
        pexelImageUrl = pexelImageArray[0];

        let filterArray = pexelImageArray?.filter(
          (val) => !usedImageArray.includes(val)
        );

        if (filterArray?.length > 0) {
          pexelImageUrl = filterArray[0];
        }
        usedImageArray.push(pexelImageUrl);
      }

      const randomSelect = Math.random() < 0.5 ? "image" : "giphy";

      let postMedia = "";
      let postMediaType = "";
      if (pexelImageUrl && giphyImageUrl) {
        if (randomSelect == "image") {
          postMedia = pexelImageUrl;
          postMediaType = "image";
        } else {
          postMedia = giphyImageUrl;
          postMediaType = "giphy";
        }
      } else if (pexelImageUrl) {
        postMedia = pexelImageUrl;
        postMediaType = "image";
      } else if (giphyImageUrl) {
        postMedia = giphyImageUrl;
        postMediaType = "giphy";
      }

      await dbService.updateOneRecords(
        "PostModel",
        { _id: postData[index]?._id },
        {
          postBody: postContent,
          postMedia: postMedia,
          postMediaType: postMediaType,
          status: POST_STATUS.SCHEDULED,
        }
      );
    }
  } catch (error) {
    console.error("generatePost error = ", error);
  }
  return "Post Generated";
};

function extractImageURL(url) {
  // Split the URL by '?' to remove any query parameters
  const parts = url.split("?");
  // Get the first part (the URL without query parameters)
  const imageURL = parts[0];
  // Check if the URL ends with a valid image extension
  if (imageURL.match(/\.(jpeg|jpg|gif|png|bmp|svg)$/)) {
    return imageURL;
  } else {
    return null; // Not a valid image URL
  }
}

function getRandomSearchText(arr) {
  if (arr.length === 0) {
    return "";
  }
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}
