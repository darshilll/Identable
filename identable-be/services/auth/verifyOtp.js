import Message from "../../utilities/messages";
import dbService from "../../utilities/dbService";

const ObjectId = require("mongodb").ObjectID;

export const verifyOtp = async (entry) => {
  let {
    body: { email, otp },
  } = entry;

  email = email.toLowerCase();

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
    throw new Error(Message.otpMismatch);
  }

  return "";
};
