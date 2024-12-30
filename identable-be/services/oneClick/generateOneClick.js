const moment = require("moment-timezone");
import dbService from "../../utilities/dbService";
import {
  POST_GENERATE_TYPE,
  POST_STATUS,
  ONE_CLICK_CAMPAIGN_STATUS,
} from "../../utilities/constants";
import { getOneClickSchedule } from "./getOneClickSchedule";

import { generateInspireMeOneClick } from "./generateInspireMeOneClick";
import { generateCarouselOneClick } from "./generateCarouselOneClick";
import { generateAIVideoOneClick } from "./generateAIVideoOneClick";
import { generateTrendingNewsOneClick } from "./generateTrendingNewsOneClick";
import { generateArticleOneClick } from "./generateArticleOneClick";

import { updateCreditUsage } from "../creditUsage/updateCreditUsage";
import { CREDIT_TYPE } from "../../utilities/constants";

const ObjectId = require("mongodb").ObjectID;

export const generateOneClick = async (entry) => {
  let {
    body: {
      topic,
      dailyPost,
      isWeekendInclude,
      duration,
      includeContentType,
      carouselTemplate,
      color,
      goal,
      isABVersion,
      isBrandKit,
      isStartImmediately,
      keyword,
      startDate,
      videoCollection,
      videoLength,
      videoRatio,
      videoVoice,
      scheduleData,
      imageStyle,
      carouselId,
    },
    user: { _id, userTimezone, currentPageId },
  } = entry;

  const subscriptionData = await dbService.findOneRecord(
    "SubscriptionModel",
    {
      userId: _id,
    },
    {
      _id: 1,
      credit: 1,
      isAIVideo: 1,
      planId: 1,
    }
  );

  if (subscriptionData?.credit <= 0) {
    throw new Error("Credit not available");
  }

  if (
    !subscriptionData?.isAIVideo &&
    includeContentType?.includes(POST_GENERATE_TYPE.AI_VIDEO)
  ) {
    throw new Error("You have no AI Video Permission");
  }

  const planData = await dbService.findOneRecord("PlanModel", {
    _id: subscriptionData?.planId,
  });

  // let scheduleData = await getOneClickSchedule(entry);

  let weekData = scheduleData;

  let oneClickObj = await dbService.createOneRecord("OneClickModel", {
    userId: _id,
    topic: topic,
    dailyPost: dailyPost,
    isWeekendInclude: isWeekendInclude,
    weekData: weekData,
    pageId: currentPageId,
    duration: duration,
    createdAt: Date.now(),
    carouselTemplate,
    color,
    goal,
    isABVersion,
    isBrandKit,
    isStartImmediately,
    keyword,
    startDate,
    videoCollection,
    imageStyle,
    videoLength,
    videoRatio,
    videoVoice,
    status: ONE_CLICK_CAMPAIGN_STATUS.IN_PROGRESS,
    campaignProgress: 0,
    includeContentType,
    carouselId: carouselId,
  });

  let bulkDataArray = [];
  const dateFormat = "YYYY-MM-DD h:mm A";

  let creditCounter = 0;

  for (let i = 0; i < weekData?.length; i++) {
    const filterDic = weekData[i];
    let matchDate = `${filterDic?.date} ${filterDic?.timeSlot}`;

    const userTimestamp = moment
      .tz(matchDate, dateFormat, userTimezone)
      .valueOf();

    let currentStart = new Date(matchDate);
    currentStart.setSeconds(0, 0);

    let scheduleDateTime = userTimestamp;

    let generatedType = POST_GENERATE_TYPE.INSPIRE_ME;

    if (filterDic?.generatedType == POST_GENERATE_TYPE.TRENDING_NEWS) {
      generatedType = POST_GENERATE_TYPE.TRENDING_NEWS;
    } else if (filterDic?.generatedType == POST_GENERATE_TYPE.AI_VIDEO) {
      generatedType = POST_GENERATE_TYPE.AI_VIDEO;
      creditCounter = creditCounter + planData?.aIVideoCredit;
    } 
    // else if (filterDic?.generatedType == POST_GENERATE_TYPE.ARTICLE) {
    //   generatedType = POST_GENERATE_TYPE.ARTICLE;
    //   creditCounter = creditCounter + planData?.articleCredit;
    // } 
    else if (filterDic?.generatedType == POST_GENERATE_TYPE.CAROUSEL) {
      generatedType = POST_GENERATE_TYPE.CAROUSEL;
      creditCounter = creditCounter + planData?.carouselCredit;
    }

    let obj = {
      userId: _id,
      pageId: currentPageId,
      postBody: "",
      postMedia: "",
      postMediaType: "",
      status: POST_STATUS.DRAFT,
      scheduleDateTime: scheduleDateTime,
      generatedType: generatedType,
      createdAt: Date.now(),
      isOneClickGenerated: true,
      oneClickId: oneClickObj?._id,
      timeSlot: filterDic?.timeSlot,
      timePeriod: filterDic?.timePeriod,
      postTopic: filterDic?.subTopic,
    };

    bulkDataArray.push({
      insertOne: {
        document: obj,
      },
    });

    creditCounter = creditCounter + planData?.advancedScheduleCredit;
  }

  if (bulkDataArray?.length > 0) {
    await dbService.updateBulkRecords("PostModel", bulkDataArray);
  }

  // ================ Update Credit ================

  await updateCreditUsage({
    userId: _id,
    pageId: currentPageId,
    creditType: CREDIT_TYPE.ONE_CLICK,
    manualCredit: creditCounter,
  });

  // ================ Generate Post ================
  generateOneClickPost({ userId: _id });

  return "Campaign scheduled successfully";
};

export const generateOneClickPost = async (entry) => {
  try {
    let { userId } = entry;

    let condition = {
      isPostGenerated: false,
      isDeleted: false,
    };
    if (userId) {
      condition = {
        ...condition,
        userId: userId,
      };
    }

    const oneClickData = await dbService.findAllRecords(
      "OneClickModel",
      condition
    );

    for (let k = 0; k < oneClickData?.length; k++) {
      const oneClickObj = oneClickData[k];

      let isTrendingNewsInclude = oneClickObj?.includeContentType?.includes(
        POST_GENERATE_TYPE.TRENDING_NEWS
      );
      let isCarouselInclude = oneClickObj?.includeContentType?.includes(
        POST_GENERATE_TYPE.CAROUSEL
      );
      let isAIVideoInclude = oneClickObj?.includeContentType?.includes(
        POST_GENERATE_TYPE.AI_VIDEO
      );
      let isArticleInclude = oneClickObj?.includeContentType?.includes(
        POST_GENERATE_TYPE.ARTICLE
      );

      await generateInspireMeOneClick({ oneClickObj: oneClickObj });
      // await generateCarouselOneClick({ oneClickObj: oneClickObj });
      if (isAIVideoInclude) {
        await generateAIVideoOneClick({ oneClickObj: oneClickObj });
      }
      if (isTrendingNewsInclude) {
        await generateTrendingNewsOneClick({ oneClickObj: oneClickObj });
      }
      if (isCarouselInclude) {
        await generateCarouselOneClick({ oneClickObj: oneClickObj });
      }
      if (isArticleInclude) {
        await generateArticleOneClick({ oneClickObj: oneClickObj });
      }

      const postDataCount = await dbService.recordsCount("PostModel", {
        oneClickId: oneClickObj?._id,
        status: POST_STATUS.DRAFT,
      });

      if (postDataCount == 0) {
        await dbService.updateOneRecords(
          "OneClickModel",
          { _id: oneClickObj?._id },
          {
            isPostGenerated: true,
            status: ONE_CLICK_CAMPAIGN_STATUS.COMPLETED,
          }
        );
      }
    }
  } catch (error) {
    console.error("generatePost error = ", error);
  }
  return "Post Generated";
};
