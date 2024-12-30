import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;
import { getLinkedinPageList } from "../user/getLinkedinPageList";
import { integrationDataEvent } from "../socketEvent/integrationDataEvent";
import { scrapePostDataJob } from "../../utilities/automationRequest";

export const saveIntegration = async (entry) => {

  let body = entry?.body;

  await dbService.updateOneRecords(
    "UserModel",
    {
      _id: body?.userId,
    },
    {
      isIntegrationProcess: false,
      isCookieValid: true,
    }
  );

  if (!body?.userId || !body?.profileData) {
    integrationDataEvent({
      userId: body?.userId,
      data: { dataStatus: false },
    });

    throw new Error("Failed to save integration data");
  }

  let {
    body: { profileData, pageData, userId },
  } = entry;

  const userData = await dbService.findOneRecord(
    "UserModel",
    {
      _id: ObjectId(userId),
    },
    {
      _id: 1,
      cookies: 1,
      cookiesExpiry: 1,
      userAgent: 1,
      proxy: 1,
    }
  );

  if (!userData) {
    integrationDataEvent({
      userId: body?.userId,
      data: { dataStatus: false },
    });

    throw new Error("User not found");
  }

  const pageModelData = await dbService.findOneRecord(
    "LinkedinPageModel",
    {
      userId: userId,
      type: "profile",
    },
    {
      _id: 1,
    }
  );

  let pageModelObj = {
    userId: ObjectId(userId),
    name: profileData?.fullName,
    image: profileData?.image,
    coverImg: profileData?.coverImg,
    url: profileData?.url,
    headline: profileData?.headline,
    about: profileData?.about,
    designation: {
      role: profileData?.designation?.role || null,
      company: profileData?.designation?.company || null,
    },
    hashtags: profileData?.hashtags,
    followersCount: extractNumber(profileData?.followersCount),
    connectionsCount: extractNumber(profileData?.connectionsCount),
    type: "profile",
    isAccess: true,
    isDeleted: false,
  };

  let profilePageId = pageModelData?._id;

  if (pageModelData) {
    pageModelObj = {
      ...pageModelObj,
      updatedAt: Date.now(),
    };

    await dbService.updateOneRecords(
      "LinkedinPageModel",
      { _id: pageModelData?._id },
      pageModelObj
    );
  } else {
    pageModelObj = {
      ...pageModelObj,
      createdAt: Date.now(),
    };
    const createdPageData = await dbService.createOneRecord(
      "LinkedinPageModel",
      pageModelObj
    );
    profilePageId = createdPageData?._id;
  }

  let bulkDataArray = [];

  for (let i = 0; i < pageData?.length; i++) {
    const pageDic = pageData[i];

    let pageModelObj = {
      designation: profileData?.designation,
      hashtags: profileData?.hashtags,
      about: profileData?.about,
      userId: ObjectId(userId),
      name: pageDic?.name,
      image: pageDic?.image,
      url: pageDic?.url,
      type: "page",
      createdAt: Date.now(),
      isDeleted: false,
    };

    bulkDataArray.push({
      updateOne: {
        filter: {
          userId: ObjectId(userId),
          url: pageDic?.url,
        },
        update: { $set: pageModelObj },
        upsert: true,
      },
    });
  }

  if (bulkDataArray?.length > 0) {
    await dbService.updateBulkRecords("LinkedinPageModel", bulkDataArray);
  }

  integrationDataEvent({
    userId: userData?._id,
    data: {
      dataStatus: true,
    },
  });

  await scrapePostDataJob({
    userId: userData?._id,
    cookies: userData?.cookies,
    cookiesExpiry: userData?.cookiesExpiry,
    userAgent: userData?.userAgent,
    pageId: profilePageId,
    proxy: userData?.proxy,
  });

  return "Linkedin data saved successfully";
};
function extractNumber(value) {
  if (value === null || value === undefined || value === "") {
    return 0;
  }

  try {
    const numericValue = value?.toString()?.replace(/[^0-9.]/g, "");
    const parsedValue = parseInt(numericValue);
    if (!isNaN(parsedValue)) {
      return parsedValue;
    } else {
      return 0;
    }
  } catch (error) {
    return 0;
  }
}
