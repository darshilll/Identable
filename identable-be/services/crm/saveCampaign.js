import dbService from "../../utilities/dbService";
import { scrapeProspectsJob } from "../../utilities/jobs/crm/scrapeProspectsJob";
import { scrapePremiumProspectsJob } from "../../utilities/jobs/crm/scrapePremiumProspectsJob";

export const saveCampaign = async (entry) => {
  let {
    body: {
      campaignType,
      campaignName,
      searchUrl,
      isPremiumAccount,
      isInMailDiscover,
      isAlreadyTalkedPeople,
    },
    user: { _id },
  } = entry;

  const pageModelData = await dbService.findOneRecord(
    "LinkedinPageModel",
    {
      userId: _id,
      type: "profile",
    },
    {
      _id: 1,
    }
  );

  let pageId = pageModelData?._id;

  let condition = {
    userId: _id,
    isDeleted: false,
    campaignName: campaignName,
  };

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

  const subscriptionData = await dbService.findOneRecord(
    "SubscriptionModel",
    {
      userId: _id,
    },
    {
      _id: 1,
      crmCampaignLimit: 1,
    }
  );

  if (campaignCount >= subscriptionData?.crmCampaignLimit) {
    throw new Error(
      "You can not create campaign at this time. Your current campaign limit is " +
        subscriptionData?.crmCampaignLimit
    );
  }

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
    pageId: pageId,
    campaignType: campaignType,
    campaignName: campaignName,
    searchUrl: searchUrl,
    isPremiumAccount: isPremiumAccount,
    isInMailDiscover: isInMailDiscover,
    isAlreadyTalkedPeople: isAlreadyTalkedPeople,
    createdAt: Date.now(),
    isProcessing: true,
    isCompanyCampaign: false,
  };

  const createdData = await dbService.createOneRecord(
    "CampaignModel",
    campaignObj
  );

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

  if (campaignType == 2) {
    await scrapePremiumProspectsJob({
      userId: userData?._id,
      pageId: pageId,
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
      pageId: pageId,
      cookies: userData?.cookies,
      cookiesExpiry: userData?.cookiesExpiry,
      userAgent: userData?.userAgent,
      proxy: userData?.proxy,
      campaignId: createdData?._id,
      searchUrl: searchUrl,
      campaignType: campaignType,
    });
  }

  return "Campaign created successfully";
};
