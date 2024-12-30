import dbService from "../../utilities/dbService";
import {
  POST_GENERATE_TYPE,
  POST_STATUS,
  SUBSCRIPTION_STATUS,
  CREDIT_TYPE,
} from "../../utilities/constants";
const ObjectId = require("mongodb").ObjectID;

import { checkCredit } from "../creditUsage/checkCredit";
import { updateCreditUsage } from "../creditUsage/updateCreditUsage";

export const savePost = async (entry) => {
  let {
    body: {
      scheduleDateTime,
      postBody,
      timeSlot,
      timePeriod,
      postMedia,
      postMediaType,
      generatedType,
      status,
      postId,
      pageId,
      generatedTypeId,
      articleHeadline,
      articleTitle,
      isBoosting,
      likeCount,
      documentDescription,
      carouselTemplate,
      carouselSetting,
      carouselId,
      articleId,
    },
    user: { _id, currentPageId },
  } = entry;

  if (generatedType == POST_GENERATE_TYPE.CAROUSEL) {
    if (!documentDescription) {
      throw new Error("Document Description is required");
    }
  }
  if (generatedType == POST_GENERATE_TYPE.ARTICLE) {
    if (!articleHeadline) {
      throw new Error("Article headline is required");
    }
    if (!articleTitle) {
      throw new Error("Article title is required");
    }
    if (!articleId) {
      throw new Error("Article id is required");
    }
  }

  const subscriptionData = await dbService.findOneRecord(
    "SubscriptionModel",
    {
      userId: _id,
    },
    {
      _id: 1,
      subscriptionStatus: 1,
    }
  );

  if (timeSlot && timePeriod) {
    await checkCredit({
      userId: _id,
      pageId: currentPageId,
      creditType: CREDIT_TYPE.ADVANCE_SCHEDULE,
    });

    if (isBoosting) {
      if (
        subscriptionData?.subscriptionStatus == SUBSCRIPTION_STATUS.TRIAL &&
        likeCount > 10
      ) {
        throw new Error("Only 10 likes allowed in trial period");
      }
    }
  }
  let existingPostData = null;

  if (postId) {
    existingPostData = await dbService.findOneRecord(
      "PostModel",
      {
        _id: postId,
      },
      { _id: 1, isBoosting: 1 }
    );
  }

  if (status == POST_STATUS.SCHEDULED) {
    let currentStart = new Date(scheduleDateTime);
    currentStart.setSeconds(0, 0);

    let currentEnd = new Date(currentStart.getTime() + 29 * 60000);
    currentEnd.setSeconds(0, 0);

    let condition = {
      userId: _id,
      isDeleted: false,
      scheduleDateTime: {
        $gte: currentStart.getTime(),
        $lte: currentEnd.getTime(),
      },
    };

    if (postId) {
      condition = {
        ...condition,
        _id: { $ne: ObjectId(postId) },
      };
    }

    const postData1 = await dbService.findOneRecord("PostModel", condition, {
      _id: 1,
    });

    if (postData1) {
      throw new Error("Post already scheduled for this time.");
    }
  }

  if (!postId) {
    if (generatedType == POST_GENERATE_TYPE.TRENDING_NEWS) {
      if (generatedTypeId) {
        const trendingNewsData = await dbService.findOneRecord(
          "TrendingNewsModel",
          {
            _id: generatedTypeId,
            isDeleted: false,
          },
          { _id: 1 }
        );

        if (!trendingNewsData) {
          throw new Error("Trending News not found");
        }

        if (status == POST_STATUS.SCHEDULED) {
          await dbService.updateOneRecords(
            "TrendingNewsModel",
            { _id: trendingNewsData?._id },
            {
              isScheduled: true,
            }
          );
        }
      }
    } else if (generatedType == POST_GENERATE_TYPE.INSPIRE_ME) {
      const inspireMeData = await dbService.findOneRecord(
        "InspireMeModel",
        {
          _id: generatedTypeId,
          isDeleted: false,
        },
        { _id: 1 }
      );

      if (!inspireMeData) {
        throw new Error("Inspire Me not found");
      }

      if (status == POST_STATUS.SCHEDULED) {
        await dbService.updateOneRecords(
          "InspireMeModel",
          { _id: inspireMeData?._id },
          {
            isScheduled: true,
            isLatest: false,
          }
        );
      }
    } else if (generatedType == POST_GENERATE_TYPE.DIY_STRATEGY) {
    } else if (generatedType == POST_GENERATE_TYPE.CAROUSEL) {
    } else if (generatedType == POST_GENERATE_TYPE.ARTICLE) {
    } else if (generatedType == POST_GENERATE_TYPE.AI_VIDEO) {
      const videoData = await dbService.findOneRecord(
        "AIVideoModel",
        {
          _id: generatedTypeId,
          isDeleted: false,
        },
        { _id: 1 }
      );

      if (!videoData) {
        throw new Error("AI Video not found");
      }

      if (status == POST_STATUS.SCHEDULED) {
        await dbService.updateOneRecords(
          "AIVideoModel",
          { _id: videoData?._id },
          {
            isScheduled: true,
          }
        );
      }
    } else {
      throw new Error("generatedType not allowed");
    }
  }

  let postObj = {
    postBody: postBody,
    postMedia: postMedia,
    postMediaType: postMediaType,
    userId: _id,
    status: status,
    pageId: currentPageId,
    articleHeadline: articleHeadline,
    articleTitle: articleTitle,
    isBoosting: isBoosting,
    likeCount: likeCount,
    documentDescription: documentDescription,
    carouselTemplate: carouselTemplate,
    carouselSetting: carouselSetting,
    carouselId: carouselId,
    articleId: articleId,
  };

  if (scheduleDateTime) {
    postObj = {
      ...postObj,
      scheduleDateTime: scheduleDateTime,
      timeSlot: timeSlot,
      timePeriod: timePeriod,
    };
  }

  if (postId) {
    postObj = {
      ...postObj,
      updatedAt: Date.now(),
    };
    await dbService.updateOneRecords(
      "PostModel",
      { _id: ObjectId(postId) },
      postObj
    );
  } else {
    postObj = {
      ...postObj,
      generatedType: generatedType,
      createdAt: Date.now(),
    };

    let createdData = await dbService.createOneRecord("PostModel", postObj);

    if (status == POST_STATUS.SCHEDULED) {
      if (generatedType == POST_GENERATE_TYPE.ARTICLE && articleId) {
        await dbService.updateOneRecords(
          "ArticleModel",
          { _id: ObjectId(articleId) },
          { isScheduled: true }
        );
      }
      await updateCreditUsage({
        userId: _id,
        pageId: currentPageId,
        creditType: CREDIT_TYPE.ADVANCE_SCHEDULE,
      });
    }
  }

  if (isBoosting) {
    if (existingPostData && !existingPostData?.isBoosting) {
      await updateCreditUsage({
        userId: _id,
        pageId: currentPageId,
        creditType: CREDIT_TYPE.BOOSTING,
      });
    } else {
      await updateCreditUsage({
        userId: _id,
        pageId: currentPageId,
        creditType: CREDIT_TYPE.BOOSTING,
      });
    }
  }

  return "Post saved successfully";
};
