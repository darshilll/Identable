import Message from "../../utilities/messages";
import dbService from "../../utilities/dbService";

const ObjectId = require("mongodb").ObjectID;

export const checkEmail = async (entry) => {
  let {
    body: { email, isForgotPassword },
  } = entry;

  email = email.toLowerCase();

  const checkEmail = await dbService.recordsCount("UserModel", {
    email: email,
  });

  if (checkEmail?.isSocial)
    throw new Error(
      "You are registered with a social account. Please log in with your social account."
    );

  if (isForgotPassword) {
    if (checkEmail) {
      return "";
    }
    throw new Error(Message.emailNotExists);
  } else {
    if (checkEmail) {
      throw new Error(Message.emailAlreadyExists);
    }
    return "";
  }
};
