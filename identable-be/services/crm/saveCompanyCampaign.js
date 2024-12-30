import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;

import { initiateLinkedinInvitationsJob } from "../../utilities/jobs/crm/initiateLinkedinInvitationsJob";
import { scrapeProspectsJob } from "../../utilities/jobs/crm/scrapeProspectsJob";
import { scrapePremiumProspectsJob } from "../../utilities/jobs/crm/scrapePremiumProspectsJob";
import { FOLLOW_STATUS } from "../../utilities/constants";

export const saveCompanyCampaign = async (entry) => {
  let {
    body: { campaignName, connectedIds, campaignType, searchUrl, pageId },
    user: { _id },
  } = entry;

  let currentPageId = ObjectId(pageId);

  if (connectedIds?.length == 0 && !searchUrl) {
    throw new Error("Please select connections.");
  }

  if (connectedIds?.length > 0) {
    connectedIds = [...new Set(connectedIds)];
  }

  const subscriptionData = await dbService.findOneRecord(
    "SubscriptionModel",
    {
      userId: _id,
    },
    {
      _id: 1,
      crmCampaignLimit: 1,
      planId: 1,
    }
  );

  if (searchUrl && campaignType) {
    const planData = await dbService.findOneRecord(
      "PlanModel",
      {
        _id: subscriptionData?.planId,
      },
      {
        isCRMCompanySearchAllow: 1,
      }
    );

    if (!planData?.isCRMCompanySearchAllow) {
      throw new Error(
        "Connecting Followers permission denied. Please upgrade your plan."
      );
    }
  }

  const userData1 = await dbService.findOneRecord(
    "UserModel",
    { _id: _id },
    {
      _id: 1,
      isAllowCRM: 1,
    }
  );

  if (!userData1?.isAllowCRM) {
    throw new Error("Permission denied.");
  }

  const campaignCount = await dbService.recordsCount("CampaignModel", {
    userId: _id,
  });

  if (campaignCount >= subscriptionData?.crmCampaignLimit) {
    throw new Error(
      "You can not create campaign at this time. Your current campaign limit is " +
        subscriptionData?.crmCampaignLimit
    );
  }

  let condition = {
    userId: _id,
    isDeleted: false,
    campaignName: campaignName,
    pageId: currentPageId,
  };

  const campaignData1 = await dbService.findOneRecord(
    "CampaignModel",
    condition,
    {
      _id: 1,
    }
  );

  if (campaignData1) {
    throw new Error("Campaign name already exists.");
  }

  let campaignObj = {
    userId: _id,
    pageId: currentPageId,
    campaignName: campaignName,
    createdAt: Date.now(),
    isProcessing: true,
    isCompanyCampaign: true,
  };

  if (campaignType && searchUrl) {
    campaignObj = {
      ...campaignObj,
      campaignType: campaignType,
      searchUrl: searchUrl,
      isPremiumAccount: false,
      isInMailDiscover: false,
      isAlreadyTalkedPeople: false,
    };
  }

  const createdData = await dbService.createOneRecord(
    "CampaignModel",
    campaignObj
  );

  let bulkDataArray = [];

  let connectedIds1 = connectedIds?.map((obj) => ObjectId(obj));

  const connectedData = await dbService.findAllRecords(
    "LinkedinConnectedModel",
    {
      _id: { $in: connectedIds1 },
      isDeleted: false,
    },
    {
      linkedinUserName: 1,
    }
  );

  for (let i = 0; i < connectedIds?.length; i++) {
    let connectedId = connectedIds[i];

    let dataObj = {
      userId: _id,
      pageId: currentPageId,
      campaignId: createdData?._id,
      linkedinConnectedId: connectedId,
      createdAt: Date.now(),
      isDeleted: false,
      currentStatus: FOLLOW_STATUS.QUEUE,
    };

    const filterArray = connectedData?.filter(
      (x) => x?._id?.toString() == connectedId?.toString()
    );
    if (filterArray.length > 0) {
      dataObj = {
        ...dataObj,
        linkedinUserName: filterArray[0].linkedinUserName,
      };
    }

    bulkDataArray.push({
      insertOne: {
        document: dataObj,
      },
    });
  }

  if (bulkDataArray?.length > 0) {
    await dbService.updateBulkRecords("LinkedinFollowingModel", bulkDataArray);
  }

  const userData = await dbService.findOneRecord(
    "UserModel",
    {
      _id: _id,
    },
    {
      _id: 1,
      proxy: 1,
      cookies: 1,
      userAgent: 1,
      cookiesExpiry: 1,
    }
  );

  const linkedinUserNames = connectedData?.map((obj) => obj?.linkedinUserName);

  const linkedinUserData = await dbService.findAllRecords(
    "LinkedinUserDataModel",
    {
      username: { $in: linkedinUserNames },
    },
    {
      name: 1,
    }
  );

  let prospectArray = [];
  for (let i = 0; i < linkedinUserData?.length; i++) {
    const linkedinUserDic = linkedinUserData[i];
    prospectArray.push({
      name: linkedinUserDic?.name,
      username: linkedinUserDic?.username,
    });
  }

  const pageData = await dbService.findOneRecord(
    "LinkedinPageModel",
    {
      _id: currentPageId,
    },
    {
      url: 1,
    }
  );

  if (prospectArray?.length > 0) {
    await initiateLinkedinInvitationsJob({
      userId: userData?._id,
      pageId: currentPageId,
      cookies: userData?.cookies,
      cookiesExpiry: userData?.cookiesExpiry,
      userAgent: userData?.userAgent,
      proxy: userData?.proxy,
      campaignId: createdData?._id,
      prospectArray: prospectArray,
      companyUrl: pageData?.url,
    });
  }

  // Start Scrape Prospects

  if (searchUrl) {
    if (campaignType == 2) {
      await scrapePremiumProspectsJob({
        userId: userData?._id,
        pageId: currentPageId,
        cookies: userData?.cookies,
        cookiesExpiry: userData?.cookiesExpiry,
        userAgent: userData?.userAgent,
        proxy: userData?.proxy,
        campaignId: createdData?._id,
        searchUrl: searchUrl,
        campaignType: campaignType,
      });
    } else {
      await scrapeProspectsJob({
        userId: userData?._id,
        pageId: currentPageId,
        cookies: userData?.cookies,
        cookiesExpiry: userData?.cookiesExpiry,
        userAgent: userData?.userAgent,
        proxy: userData?.proxy,
        campaignId: createdData?._id,
        searchUrl: searchUrl,
        campaignType: campaignType,
      });
    }
  }

  return "Campaign Created Successfully";
};
