import dbService from "../../utilities/dbService";
import { SUBSCRIPTION_STATUS } from "../../utilities/constants";
import { createCommonPrompt } from "../../utilities/openAi";
import { generateArticleOpenAI } from "../../utilities/openAi";

import { checkCredit } from "../creditUsage/checkCredit";
import { updateCreditUsage } from "../creditUsage/updateCreditUsage";
import { CREDIT_TYPE } from "../../utilities/constants";
import { getLinkPreview } from "../general/getLinkPreview";

import { generateAIImageAction } from "../aiimage/generateAIImageAction";
import { generatePexelImage } from "../../utilities/generatePexelImage";
import { generateGiphy } from "../../utilities/generateGiphy";
import { successAction, failAction } from "../../utilities/response";

const ObjectId = require("mongodb").ObjectID;

export const streamArticle = async (req, res, next) => {
  try {
    const {
      query: { articleId },
      user: { _id, chatGPTVersion, currentPageId },
    } = req;

    let where = {
      userId: _id,
      _id: ObjectId(articleId),
    };

    let articleData = await dbService.findOneRecord("ArticleModel", where);
    if (!articleData) {
      res.status(400).json(failAction("Article not found"));
    }
    let goal = articleData?.goal;
    let topic = articleData?.topic;
    let keywords = articleData?.keywords;
    let headline = articleData?.headline;
    let headingData = articleData?.headingData;
    let isFAQ = articleData?.isFAQ;
    let isConclusion = articleData?.isConclusion;
    let isCTA = articleData?.isCTA;
    let youtubeVideos = articleData?.youtubeVideos;
    let authorityLinks = articleData?.authorityLinks;
    let length = articleData?.length;
    let language = articleData?.language;
    let factualData = articleData?.factualData;
    let imageCount = articleData?.imageCount;
    let imageSource = articleData?.imageSource;
    let imageOrientation = articleData?.imageOrientation;
    let bannerImageSetting = articleData?.bannerImageSetting;
    let isAltTag = articleData?.isAltTag;

    await checkCredit({
      userId: _id,
      pageId: currentPageId,
      creditType: CREDIT_TYPE.ARTICLE,
    });

    // =============== Image Selection ===============
    let aiImage = "";

    if (imageSource == "ai image") {
      let prompt = `Create a article content image based on these article goal: ${goal}, article topic: ${topic}, article keywords: ${keywords}, article headline: ${headline}. We need to add this image in between article.`;

      aiImage = await generateAIImageAction({
        userId: _id,
        pageId: currentPageId,
        size: "1024x1024",
        promptVal: prompt,
      });

      await updateCreditUsage({
        userId: _id,
        pageId: currentPageId,
        creditType: CREDIT_TYPE.AI_IMAGE,
      });
    } else if (imageSource == "pexel" || imageSource == "random") {
      let pexelImageArray = await generatePexelImage({
        searchText: keywords,
      });

      if (pexelImageArray?.length > 0) {
        aiImage = pexelImageArray[0];
      }
    } else if (imageSource == "giphy") {
      let giphyImageArray = await generateGiphy({
        searchText: keywords,
      });

      if (giphyImageArray?.length > 0) {
        aiImage = giphyImageArray[0];
      }
    }

    // =============== End Image Selection ===============

    const output = convertArrayToString(headingData);

    let prompt = `Using html formatting, bolded words, lists and tables where possible generate a fairly 3000 - 4000 words article based on these article goal: ${goal}, article topic: ${topic}, article keywords: ${keywords}, article headline: ${headline} and the article outline ${output}. `;

    prompt += `Add Title tag, Meta Description, `;

    if (isFAQ) {
      prompt += `Add FAQs in article. `;
    }
    if (isConclusion) {
      prompt += `Add Conclusion in article. `;
    }
    if (youtubeVideos?.length > 0) {
      prompt += `Add this Youtube video links ${youtubeVideos} in betweekn article. `;
    } else {
      prompt += `search youtube video related to article and add in article. `;
    }
    if (authorityLinks?.length > 0) {
      prompt += `Add authority links ${authorityLinks} in between article. `;
    } else {
      prompt += `Search links related to article add in article. `;
    }
    if (aiImage) {
      prompt += `Add image ${aiImage} in between article. `;
    }

    // if (length) {
    //   prompt += `Article length must be ${length}.`;
    // }

    prompt += `
  - Do not echo my command or parameters.
  `;

    let result = await generateArticleOpenAI(
      {
        prompt: prompt,
        chatGPTVersion: chatGPTVersion,
      },
      res
    );

    await updateCreditUsage({
      userId: _id,
      pageId: currentPageId,
      creditType: CREDIT_TYPE.ARTICLE,
    });

    console.log("end.... = ", result);
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};

function convertArrayToString(arr) {
  let result = [];

  arr.forEach((item) => {
    for (let key in item) {
      if (Array.isArray(item[key])) {
        item[key].forEach((value) => {
          result.push(`${key}:${value}`);
        });
      } else {
        result.push(`${key}:${item[key]},`);
      }
    }
  });

  return result.join("\n");
}
