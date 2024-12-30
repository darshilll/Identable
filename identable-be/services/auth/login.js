import Message from "../../utilities/messages";
import dbService from "../../utilities/dbService";
import { generateJwtTokenFn } from "../../utilities/generateJwtTokenFn";
import { decryptPassword } from "../../utilities/decryptPassword";

const ObjectId = require("mongodb").ObjectID;

export const login = async (entry) => {
  let {
    body: { email, password },
  } = entry;

  const userData = await dbService.findOneRecord("UserModel", {
    email: email.toLowerCase(),
    isDeleted: false,
  });

  if (!userData) throw new Error(Message.invalidCredentials);
  if (userData?.isSocial)
    throw new Error(
      "You are registered with a social account. Please log in with your social account."
    );

  let match = await decryptPassword(password, userData.password);
  if (!match) throw new Error(Message.invalidCredentials);

  let userId = userData?._id;

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
