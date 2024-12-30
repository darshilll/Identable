import dbService from "../../utilities/dbService";
import { getNews } from "../../utilities/news";

const ObjectId = require("mongodb").ObjectID;
import { generateKeywordPrompt } from "../openai/generateKeywordPrompt";
import { checkCredit } from "../creditUsage/checkCredit";
import { updateCreditUsage } from "../creditUsage/updateCreditUsage";
import { CREDIT_TYPE } from "../../utilities/constants";

export const searchNews = async (entry) => {
  let {
    body: { searchKeyword },
    user: { _id, chatGPTVersion, currentPageId },
  } = entry;

  let keyword = searchKeyword; //?.join(",")?.replace(/#/g, "");

  await checkCredit({
    userId: _id,
    pageId: currentPageId,
    creditType: CREDIT_TYPE.TRENDING_NEWS_SEARCH,
  });

  let result = await generateKeywordPrompt({
    keyword,
    userId: _id,
    chatGPTVersion,
  });

  let trendingNewsData = [];
  if (result?.data) {
    let keywordsArray = result?.data?.map((obj) => obj?.data);
    let keywordString = keywordsArray?.join(",")?.replace(/,/g, " OR ");

    let newsData = await getNews({ seatchText: keywordString });

    for (let i = 0; i < newsData?.articles?.length; i++) {
      const newsDic = newsData?.articles[i];

      let obj = {
        author: newsDic?.author,
        title: newsDic?.title,
        description: newsDic?.description,
        url: newsDic?.url,
        urlToImage: newsDic?.urlToImage,
        publishedAt: newsDic?.publishedAt,
        content: newsDic?.content,
        isScheduled: false,
      };
      trendingNewsData.push(obj);
    }
  }

  await updateCreditUsage({
    userId: _id,
    pageId: currentPageId,
    creditType: CREDIT_TYPE.TRENDING_NEWS_SEARCH,
  });

  const trendingNewsArray = [];

  trendingNewsData.forEach((obj) => {
    if (
      obj?.content != "[Removed]" &&
      obj?.title != "[Removed]" &&
      obj?.description != "[Removed]"
    ) {
      trendingNewsArray.push(obj);
    }
  });

  return trendingNewsArray;
};
