import dbService from "../../utilities/dbService";
import { getNews } from "../../utilities/news";
import { generatePost } from "../post/generatePost";

const ObjectId = require("mongodb").ObjectID;
import { generateKeywordPrompt } from "../openai/generateKeywordPrompt";

export const getInspireMe = async (entry) => {
  let {
    body: { pageId, contentType },
    user: { _id, chatGPTVersion, currentPageId },
  } = entry;

  await generatePost({ userId: _id, isFromList: true });

  let inspireMeData = await dbService.findAllRecords(
    "InspireMeModel",
    {
      userId: _id,
      pageId: currentPageId,
      inspireMeType: contentType,
    },
    {
      topic: 1,
      post: 1,
      keyword: 1,
      giphy: 1,
      image: 1,
      pexel: 1,
      isScheduled: 1,
      isLatest: 1,
      createdAt: 1,
      defultMedia: 1,
      postTopic: 1,
    },
    {
      isScheduled: 1,
      _id: -1,
    }
  );

  return inspireMeData;
};
