import Message from "../../utilities/messages";
import dbService from "../../utilities/dbService";
import { generateJwtTokenFn } from "../../utilities/generateJwtTokenFn";
import { PLAN, SUBSCRIPTION_STATUS } from "../../utilities/constants";

import {
  getLinkedinAccessToken,
  getLinkedinEmailDetails,
  getLinkedinProfileDetails,
} from "../../utilities/linkedin";

const ObjectId = require("mongodb").ObjectID;

export const socialLogin = async (entry) => {
  let {
    body: { code },
  } = entry;

  // Get Access Token
  let accessToken = await getLinkedinAccessToken({ code: code });
  if (!accessToken) {
    throw new Error("Access token not found");
  }

  // Get Email Address
  let email = await getLinkedinEmailDetails({ accessToken: accessToken });
  if (!email) {
    throw new Error("Email not found");
  }

  // Get Basic Profile Details
  let profileData = await getLinkedinProfileDetails({
    accessToken: accessToken,
  });
  if (!profileData) {
    throw new Error("Profile not found");
  }

  let firstName = profileData?.localizedFirstName;
  let lastName = profileData?.localizedLastName;
  let socialId = profileData?.id;

  const userData = await dbService.findOneRecord("UserModel", {
    socialId: socialId,
    isDeleted: false,
  });

  let userId = "";
  userId = userData?._id;

  let saveObj = {
    firstName: firstName,
    lastName: lastName,
    socialId: socialId,
    socialType: "Linkedin",
    email: email,
    accessToken: accessToken,
    isSocial: true,
  };

  if (!userData) {
    const proxyData = await dbService.findOneRecord("ProxyModel", {
      isUsed: false,
    });

    if (proxyData) {
      await dbService.updateOneRecords(
        "ProxyModel",
        {
          _id: proxyData?._id,
        },
        {
          isUsed: true,
        }
      );

      saveObj = {
        ...saveObj,
        proxy: proxyData?.proxy,
      };
    }

    saveObj = {
      ...saveObj,
      createdAt: Date.now(),
    };
    let createdData = await dbService.createOneRecord("UserModel", saveObj);

    userId = createdData?._id;

    await subscribeTrialPlan({ userId: userId });
  } else {
    saveObj = {
      ...saveObj,
      updatedAt: Date.now(),
    };

    await dbService.updateOneRecords(
      "UserModel",
      {
        _id: userData?._id,
      },
      saveObj
    );
  }

  const data = await dbService.findOneAndUpdateRecord(
    "UserModel",
    { _id: userId },
    {
      $set: {
        loginToken: await generateJwtTokenFn({
          userId: userId,
        }),
        lastActiveDate: Date.now(),
      },
    },
    { new: true }
  );

  return {
    userId: userId,
    token: data.loginToken,
  };
};

export const subscribeTrialPlan = async (entry) => {
  let { userId } = entry;

  const trialPlan = await dbService.findOneRecord("PlanModel", {
    _id: ObjectId(PLAN.TRY_IT_ON),
  });

  await dbService.createOneRecord("SubscriptionModel", {
    userId: userId,
    planId: trialPlan?._id,
    subscriptionStatus: SUBSCRIPTION_STATUS.TRIAL,
    lastRenewDate: new Date(),
    renewCycleDate: new Date().setDate(new Date().getDate() + 7),
    credit: trialPlan?.credit,
    crmCampaignLimit: trialPlan?.crmCampaignLimit,
    companyProfileLimit: trialPlan?.companyProfileLimit,
    createdAt: Date.now(),
  });
};
