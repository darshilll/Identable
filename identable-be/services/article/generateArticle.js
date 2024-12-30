import dbService from "../../utilities/dbService";
import { checkCredit } from "../creditUsage/checkCredit";
import { CREDIT_TYPE } from "../../utilities/constants";
const ObjectId = require("mongodb").ObjectID;

export const generateArticle = async (entry, isRegenerated = false) => {
  let {
    body: {
      goal,
      topic,
      keywords,
      headline,
      headingData,
      isFAQ,
      isConclusion,
      isCTA,
      youtubeVideos,
      authorityLinks,
      length,
      language,
      factualData,
      imageCount,
      imageSource,
      imageOrientation,
      bannerImageSetting,
      isAltTag,
    },
    user: { _id, chatGPTVersion, currentPageId },
  } = entry;

  await checkCredit({
    userId: _id,
    pageId: currentPageId,
    creditType: CREDIT_TYPE.ARTICLE,
  });

  let updateObj = {
    userId: _id,
    pageId: currentPageId,
    goal: goal,
    topic: topic,
    keywords: keywords,
    headline: headline,
    content: "",
    bannerImageSetting: bannerImageSetting,
    bannerImage: "",
    headingData: headingData,
    youtubeVideos: youtubeVideos,
    authorityLinks: authorityLinks,
    isFAQ: isFAQ,
    isConclusion: isConclusion,
    isCTA: isCTA,
    language: language,
    length: length,
    factualData: factualData,
    imageCount: imageCount,
    imageSource: imageSource,
    imageOrientation: imageOrientation,
    isAltTag: isAltTag,
    createdAt: Date.now(),
  };

  let insertResult = await dbService.createOneRecord("ArticleModel", updateObj);

  let where = {
    userId: _id,
    _id: insertResult?._id,
  };

  let result = await dbService.findOneRecord("ArticleModel", where, {
    _id: 1,
    goal: 1,
    topic: 1,
    keywords: 1,
    headline: 1,
    content: 1,
    bannerImage: 1,
    bannerImageSetting: 1,
    headingData: 1,
    youtubeVideos: 1,
    authorityLinks: 1,
    isFAQ: 1,
    isConclusion: 1,
    isCTA: 1,
    language: 1,
    length: 1,
    factualData: 1,
    imageCount: 1,
    imageSource: 1,
    imageOrientation: 1,
    isAltTag: 1,
    isScheduled: 1,
    createdAt: 1,
  });

  return result;
};
