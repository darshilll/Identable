import dbService from "../../utilities/dbService";
import { SUBSCRIPTION_STATUS } from "../../utilities/constants";
const ObjectId = require("mongodb").ObjectID;

// Utility function for validating profile photo
import { validateProfilePhoto } from "../../utilities/faceAnalyzeService";
import { generateAIImageAction } from "../aiimage/generateAIImageAction";

export const getUserDetails = async (entry) => {
  let {
    body: { timezone },
    user: { _id, currentPageId },
  } = entry;

  // Fetch user data
  let userData = await dbService.findOneRecord(
    "UserModel",
    {
      _id: _id,
    },
    {
      firstName: 1,
      lastName: 1,
      email: 1,
      timezone: 1,
      isGeneral: 1,
      isIntegration: 1,
      isAISetting: 1,
      isBilling: 1,
      currentPageId: 1,
      isDsahboardLoaded: 1,
      chatGPTVersion: 1,
      cookies: 1,
      isAllowCRM: 1,
      isCookieValid: 1,
      isCompanyPageVisited: 1,
      userRole: 1,
      isAutoAiSetting: 1,
      isBrandInfo: 1,
      phoneNumber: 1,
      countryCode: 1,
    }
  );

  // Fetch subscription data
  let subscriptionData = await dbService.findOneRecord(
    "SubscriptionModel",
    {
      userId: _id,
    },
    {
      subscriptionStatus: 1,
      cancelReason: 1,
      planId: 1,
      renewCycleDate: 1,
      recurringType: 1,
      credit: 1,
    }
  );

  // Fetch plan data
  let planData = await dbService.findOneRecord(
    "PlanModel",
    {
      _id: subscriptionData?.planId,
    },
    {
      planName: 1,
      planDescription: 1,
      monthlyPriceUSD: 1,
      yearlyPriceUSD: 1,
      credit: 1,
      carouselCredit: 1,
      aIVideoCredit: 1,
      boostingCredit: 1,
      advancedScheduleCredit: 1,
      aiImageCredit: 1,
      discoverEmailCredit: 1,
      searchNewsCredit: 1,
      articleCredit: 1,
      contentAnalyzeCredit: 1,
      contentHumanizeCredit: 1,
      isCRMCompanySearchAllow: 1,
    }
  );

  // Fetch AI settings
  const settingData = await dbService.findOneRecord(
    "AIAdvanceSettingModel",
    {
      userId: _id,
      pageId: currentPageId,
    },
    {
      _id: 0,
      formality: 1,
    }
  );

  // Check integration status
  let isIntegrationExpired = false;
  if (!userData?.cookies) {
    isIntegrationExpired = true;
  }

  let data = JSON.parse(JSON.stringify(userData));
  delete data.cookies;

  // Fetch post data
  const postData = await dbService.findAllRecords(
    "PostModel",
    {
      userId: _id,
      pageId: currentPageId,
      isDeleted: false,
    },
    {
      timeSlot: 1,
      linkedinPostId: 1,
    }
  );

  let linkedinPostIds = postData?.map((obj) => obj?.linkedinPostId);

  // Aggregate LinkedIn post data
  let linkedinPostDataAggregate = [
    {
      $match: {
        userId: _id,
        pageId: currentPageId,
        postId: {
          $in: linkedinPostIds,
        },
      },
    },
    {
      $sort: {
        impressionCount: -1,
      },
    },
    {
      $limit: 3,
    },
    {
      $project: {
        postId: 1,
      },
    },
  ];
  let linkedinPostData = await dbService.aggregateData(
    "LinkedinPostModel",
    linkedinPostDataAggregate
  );

  let bestPostTimeArray = [];
  if (linkedinPostData?.length > 0) {
    for (let i = 0; i < linkedinPostData?.length; i++) {
      const item = linkedinPostData[i];
      const filterArray = postData?.filter(
        (x) => x?.linkedinPostId == item?.postId
      );

      if (filterArray?.length > 0) {
        bestPostTimeArray.push(filterArray[0]?.timeSlot);
      }
    }
  }

  // Fetch LinkedIn page data
  const linkedinPageData = await dbService.findAllRecords(
    "LinkedinPageModel",
    {
      userId: _id,
      isDeleted: false,
      isAccess: true,
    },
    {
      url: 1,
      image: 1,
      designation: 1,
      about: 1,
      name: 1,
      coverImg: 1,
      contactInfo: 1,
      currentJob: 1,
    }
  );

  const profilePhotoUrl =
    linkedinPageData.find((page) => !!page.image)?.image || null;
  const photoValidation = profilePhotoUrl
    ? await validateProfilePhoto(profilePhotoUrl)
    : { isValid: false, message: "No profile photo provided." };

  const profilePhoto = {
    isValid: photoValidation.isValid,
    message: photoValidation.message,
    profilePhotoUrl: profilePhotoUrl || "No photo URL available.",
  };

  const profileUrlExists = linkedinPageData.some((page) => !!page.url);

  let coverImgExists = linkedinPageData.some((page) => !!page.coverImg);
  let generatedCoverImg = null;

  if (!coverImgExists) {
    const settingData = await dbService.findOneRecord("AIAdvanceSettingModel", {
      pageId: currentPageId,
    });

    const topic = settingData?.about || "default topic";
    const keywords = settingData?.keyword?.map((item) => `${item}`).join(", ");

    generatedCoverImg = await generateAIImageAction({
      topic,
      keywords,
      userId: _id,
      pageId: currentPageId,
      size: "1024x1024",
    });

    if (!generatedCoverImg) {
      throw new Error("Failed to generate cover photo. Please try again.");
    }

    await dbService.findOneAndUpdateRecord(
      "LinkedinPageModel",
      { userId: _id, isDeleted: false, isAccess: true },
      { $set: { coverImg: generatedCoverImg } }
    );

    coverImgExists = true;
  } else {
    generatedCoverImg =
      linkedinPageData.find((page) => !!page.coverImg)?.coverImg || null;
  }

  const linkedinPageOptimization = {
    profilePhoto,
    profileUrl: profileUrlExists,
    headline: linkedinPageData.some((page) => !!page.designation),
    about: linkedinPageData.some((page) => !!page.about),
    coverImg: coverImgExists,
    generatedCoverImg,
    designation: linkedinPageData.some(
      (page) => page.designation?.role && page.designation?.company
    ),
  };

  let responseData = {
    ...data,
    plan: planData,
    subscription: subscriptionData,
    aiSetting: settingData,
    isIntegrationExpired: isIntegrationExpired,
    linkedinPageOptimization,
    temp2: "hello123",
  };

  return responseData;
};
