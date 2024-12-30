import Message from "../../utilities/messages";
import dbService from "../../utilities/dbService";
import { generateJwtTokenFn } from "../../utilities/generateJwtTokenFn";
import { encryptpassword } from "../../utilities/encryptpassword";
import { subscribeTrialPlan } from "../auth/socialLogin";

const ObjectId = require("mongodb").ObjectID;

export const signup = async (entry) => {
  let {
    body: { email, password, name, otp },
  } = entry;

  const verificationArray = await dbService.findAllRecords(
    "VerificationModel",
    {
      email: email,
      otp: otp,
    },
    { createdAt: 1 },
    { _id: -1 },
    1
  );
  if (verificationArray?.length == 0) {
    throw new Error("Invalid OTP");
  }
  const verificationData = verificationArray[0];

  let currentTime = new Date().getTime();
  let seconds = (currentTime - verificationData?.createdAt) / 1000;

  if (seconds >= 120) {
    throw new Error("OTP has expired");
  }

  await dbService.removeRecords("VerificationModel", {
    email: email,
  });

  email = email.toLowerCase();
  if (await dbService.findOneRecord("UserModel", { email }, { _id: 1 }))
    throw new Error(Message.emailAlreadyExists);

  let nameArray = name?.split(" ");

  let firstName = "";
  let lastName = "";

  if (nameArray?.length > 0) {
    firstName = nameArray[0];
  }

  if (nameArray?.length > 1) {
    lastName = nameArray[1];
  }

  let encryptpassword1 = await encryptpassword(password);

  let saveObj = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: encryptpassword1,
    createdAt: Date.now(),
  };

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

  let createdData = await dbService.createOneRecord("UserModel", saveObj);

  let userId = createdData?._id;

  await subscribeTrialPlan({ userId: userId });

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
