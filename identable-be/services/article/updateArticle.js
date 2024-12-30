import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;

export const updateArticle = async (entry) => {
  let {
    body: {
      goal,
      topic,
      keywords,
      headline,
      content,
      bannerImage,
      bannerImageSetting,
      articleId,
      titleTag,
      metaTag,
    },
    user: { _id, chatGPTVersion, currentPageId },
  } = entry;

  let updateObj = {
    isUpdated: true,
  };

  if (goal) {
    updateObj = {
      ...updateObj,
      goal: goal,
    };
  }

  if (topic) {
    updateObj = {
      ...updateObj,
      topic: topic,
    };
  }

  if (keywords) {
    updateObj = {
      ...updateObj,
      keywords: keywords,
    };
  }

  if (headline) {
    updateObj = {
      ...updateObj,
      headline: headline,
    };
  }

  if (content) {
    updateObj = {
      ...updateObj,
      content: content,
    };
  }

  if (bannerImage) {
    updateObj = {
      ...updateObj,
      bannerImage: bannerImage,
    };
  }

  if (bannerImageSetting) {
    updateObj = {
      ...updateObj,
      bannerImageSetting: bannerImageSetting,
    };
  }

  if (titleTag) {
    updateObj = {
      ...updateObj,
      titleTag: titleTag,
    };
  }

  if (metaTag) {
    updateObj = {
      ...updateObj,
      metaTag: metaTag,
    };
  }

  updateObj = {
    ...updateObj,
    updatedAt: Date.now(),
  };

  await dbService.updateOneRecords(
    "ArticleModel",
    { _id: ObjectId(articleId) },
    updateObj
  );

  let where = {
    userId: _id,
    _id: ObjectId(articleId),
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
    titleTag: 1,
    metaTag: 1,
  });

  return result;
};
