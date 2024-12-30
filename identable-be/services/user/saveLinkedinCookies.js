import dbService from "../../utilities/dbService";
import { RECURRING_TYPE } from "../../utilities/constants";
import { scrapeLinkedinUserDataJob } from "../../utilities/automationRequest";
import { getLinkedinPageList } from "./getLinkedinPageList";

const ObjectId = require("mongodb").ObjectID;

export const saveLinkedinCookies = async (entry) => {
  let {
    body: { cookies },
    user: { _id },
  } = entry;

  const userData = await dbService.findOneRecord(
    "UserModel",
    {
      _id: _id,
    },
    {
      _id: 1,
      isIntegrationProcess: 1,
      proxy: 1,
    }
  );

  if (!userData) {
    throw new Error("User not found");
  }

  if (userData?.isIntegrationProcess) {
    throw new Error("Your previous request is still processing. Please wait.");
  }

  const cookieString = cookies;
  const decodedValue = decodeBase64(cookieString);

  // Extract the values

  let cookieValue = "";
  let timestamp = "";
  let userAgent = "";

  const parts = decodedValue?.split(":");
  if (parts?.length > 2) {
    cookieValue = parts[0];
    if (parts[1]?.length > 0) {
      if (parts[1]?.split(".")?.length > 0) {
        timestamp = parts[1]?.split(".")[0];
      }
    }
    userAgent = parts[2];
  }

  if (!cookieValue || !timestamp || !userAgent) {
    throw new Error("Cookie failed to extract");
  }

  await dbService.updateOneRecords(
    "UserModel",
    {
      _id: _id,
    },
    {
      cookies: cookieValue,
      userAgent: userAgent,
      cookiesExpiry: timestamp,
      isIntegrationProcess: true,
    }
  );

  const botData = await dbService.findOneRecord(
    "BotModel",
    {
      userId: _id,
    },
    { _id: 1 }
  );

  let botDoc = {
    proxy: userData?.proxy,
    cookies: cookieValue,
    cookiesExpiry: timestamp,
    userAgent: userAgent,
    isCookieValid: true,
    userId: _id,
  };

  if (botData) {
    botDoc = {
      ...botDoc,
      updatedAt: Date.now(),
    };

    await dbService.updateOneRecords(
      "BotModel",
      {
        _id: botData?._id,
      },
      botDoc
    );
  } else {
    botDoc = {
      ...botDoc,
      createdAt: Date.now(),
    };
    await dbService.createOneRecord("BotModel", botDoc);
  }

  let status = await scrapeLinkedinUserDataJob({
    userId: _id,
    cookies: cookieValue,
    cookiesExpiry: timestamp,
    userAgent: userAgent,
    proxy: userData?.proxy,
  });

  if (!status) {
    throw new Error(
      "Failed to get LinkedIn data. Please try again or contact support."
    );
  }

  return "Success";
};

function decodeBase64(base64String) {
  const decodedBuffer = Buffer.from(base64String, "base64");
  const decodedString = decodedBuffer.toString("utf-8");
  return decodedString;
}
