import dbService from "../../utilities/dbService";
import { PLAN } from "../../utilities/constants";

const ObjectId = require("mongodb").ObjectID;

export const getLinkedinPageList = async (entry) => {
  let {
    user: { _id, currentPageId },
  } = entry;

  const settingData = await dbService.findOneRecord(
    "AIAdvanceSettingModel",
    {
      userId: _id,
      type: "profile",
    },
    {
      pageId: 1,
    }
  );

  const linkedinProfileData = await dbService.findOneRecord(
    "LinkedinPageModel",
    {
      userId: _id,
      type: "profile",
    },
    {
      name: 1,
      designation: 1,
      image: 1,
      profileLink: 1,
      followersCount: 1,
      connectionsCount: 1,
      hashtags: 1,
      about: 1,
    }
  );

  const linkedinPageData = await dbService.findAllRecords(
    "LinkedinPageModel",
    {
      userId: _id,
      isDeleted: false,
    },
    {
      _id: 1,
      name: 1,
      image: 1,
      url: 1,
      type: 1,
      isAccess: 1,
      about: 1,
      designation: 1,
      followersCount: 1,
      connectionsCount: 1,
      coverImg: 1,
      // contactInfo: 1,
      // experience: 1,
      // currentJob: 1,
    },
    {
      type: -1,
    }
  );

  if (linkedinPageData?.length > 0) {
    await dbService.updateOneRecords(
      "UserModel",
      { _id: _id },
      {
        isIntegration: true,
      }
    );
  }

  return { linkedinPageData: linkedinPageData };
};
