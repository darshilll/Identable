import dbService from "../../utilities/dbService";
import { getNews } from "../../utilities/news";

const ObjectId = require("mongodb").ObjectID;
import { generateKeywordPrompt } from "../openai/generateKeywordPrompt";

export const getTrendingNews = async (entry) => {
  let {
    body: {},
    user: { _id, chatGPTVersion, currentPageId },
  } = entry;

  let trendingNewsData = await dbService.findAllRecords(
    "TrendingNewsModel",
    {
      userId: _id,
      pageId: currentPageId,
    },
    {
      author: 1,
      title: 1,
      description: 1,
      url: 1,
      urlToImage: 1,
      publishedAt: 1,
      content: 1,
      isScheduled: 1,
    }
  );

  if (trendingNewsData?.length == 0) {
    const pageData = await dbService.findOneRecord(
      "AIAdvanceSettingModel",
      {
        userId: _id,
        pageId: currentPageId,
      },
      {
        keyword: 1,
      }
    );

    if (!pageData) {
      throw new Error("Page data not found");
    }

    let keyword = pageData?.keyword?.join(",")?.replace(/#/g, "");

    let result = await generateKeywordPrompt({
      keyword,
      userId: _id,
      chatGPTVersion,
    });

    if (result?.data) {
      let keywordsArray = result?.data?.map((obj) => obj?.data);
      let keywordString = keywordsArray?.join(",")?.replace(/,/g, " OR ");

      let newsData = await getNews({ seatchText: keywordString });

      let bulkDataArray = [];

      for (let i = 0; i < newsData?.articles?.length; i++) {
        const newsDic = newsData?.articles[i];

        bulkDataArray.push({
          insertOne: {
            document: {
              userId: _id,
              pageId: currentPageId,
              author: newsDic?.author,
              title: newsDic?.title,
              description: newsDic?.description,
              url: newsDic?.url,
              urlToImage: newsDic?.urlToImage,
              publishedAt: newsDic?.publishedAt,
              content: newsDic?.content,
              createdAt: Date.now(),
            },
          },
        });
      }

      if (bulkDataArray?.length > 0) {
        await dbService.updateBulkRecords("TrendingNewsModel", bulkDataArray);
      }

      trendingNewsData = await dbService.findAllRecords(
        "TrendingNewsModel",
        {
          userId: _id,
          pageId: currentPageId,
        },
        {
          author: 1,
          title: 1,
          description: 1,
          url: 1,
          urlToImage: 1,
          publishedAt: 1,
          content: 1,
          isScheduled: 1,
        }
      );
    }
  }
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
