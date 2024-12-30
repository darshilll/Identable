import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;

export const getArticleList = async (entry) => {
  let {
    body: { searchText, sortMode },
    user: { _id },
  } = entry;

  let sortBy = { createdAt: -1 };
  if (sortMode) {
    sortBy = {
      createdAt: 1,
    };
  }

  let where = {
    userId: _id,
    isDeleted: false,
  };

  if (searchText) {
    const regex = new RegExp(searchText, "i");

    where = {
      ...where,
      headline: { $regex: regex },
    };
  }

  let result = await dbService.findAllRecords(
    "ArticleModel",
    where,
    {
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
    },
    sortBy
  );

  return result;
};
