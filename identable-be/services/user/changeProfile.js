import dbService from "../../utilities/dbService";
import { RECURRING_TYPE } from "../../utilities/constants";
import { generatePost } from "../post/generatePost";
import { scrapePostDataJob } from "../../utilities/automationRequest";

const ObjectId = require("mongodb").ObjectID;

export const changeProfile = async (entry) => {
  let {
    body: { pageId },
    user: { _id },
  } = entry;

  const advanceSettingData = await dbService.findOneRecord(
    "AIAdvanceSettingModel",
    {
      pageId: ObjectId(pageId),
      userId: _id,
    },
    {
      _id: 1,
    }
  );

  if (!advanceSettingData) {
    throw new Error(
      "AI settings not found for this profile. Please set up AI settings from the Account Settings menu."
    );
  }

  await dbService.updateOneRecords(
    "UserModel",
    { _id: _id },
    {
      currentPageId: pageId,
    }
  );

  await dbService.updateOneRecords(
    "AIAdvanceSettingModel",
    { _id: advanceSettingData?._id },
    {
      isCurrentPage: true,
    }
  );

  generatePost({ userId: _id });

  const userData = await dbService.findOneRecord(
    "UserModel",
    {
      _id: _id,
    },
    {
      _id: 1,
      cookies: 1,
      cookiesExpiry: 1,
      userAgent: 1,
      proxy: 1,
    }
  );

  const linkedinPostCount = await dbService.recordsCount("LinkedinPostModel", {
    pageId: ObjectId(pageId),
  });

  if (linkedinPostCount == 0) {
    const pageModelData = await dbService.findOneRecord(
      "LinkedinPageModel",
      {
        _id: ObjectId(pageId),
      },
      {
        _id: 1,
        type: 1,
        url: 1,
      }
    );

    let jobObj = {
      userId: userData?._id,
      cookies: userData?.cookies,
      cookiesExpiry: userData?.cookiesExpiry,
      userAgent: userData?.userAgent,
      pageId: pageId,
      proxy: userData?.proxy,
    };

    if (pageModelData?.type == "page") {
      jobObj = {
        ...jobObj,
        companyUrl: pageModelData?.url,
      };
    }

    await scrapePostDataJob(jobObj);
  }

  return "Profile switched successfully";
};
