import Message from "../../utilities/messages";
import dbService from "../../utilities/dbService";
import { sendEmail } from "../../utilities/emailService";
import { generateRandom } from "../../utilities/generateRandom";
import { VERIFICATION_CODE_TEMPLATE } from "../../utilities/emailTemplate/verificationCodeTemplate";
import Handlebars from "handlebars";

const ObjectId = require("mongodb").ObjectID;

export const sendOtp = async (entry) => {
  let {
    body: { email, name },
  } = entry;

  email = email.toLowerCase();

  let otp = generateRandom(4, false);

  let code1 = otp[0];
  let code2 = otp[1];
  let code3 = otp[2];
  let code4 = otp[3];

  let context = {
    name: name,
    code1: code1,
    code2: code2,
    code3: code3,
    code4: code4,
  };

  var templateData = Handlebars.compile(VERIFICATION_CODE_TEMPLATE);
  var html = templateData(context);

  await sendEmail({
    email: email,
    subject: "Identable Email Verification Code",
    body: html,
  });

  await dbService.createOneRecord("VerificationModel", {
    email: email,
    otp: otp,
    createdAt: Date.now(),
  });

  return "OTP sent successfully";
};
