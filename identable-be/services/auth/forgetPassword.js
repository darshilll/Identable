import dbService from "../../utilities/dbService";
import { getUniqueId } from "../../utilities/generateRandom";
import { sendEmail } from "../../utilities/emailService";
import { RESET_PASSWORD_TEMPLATE } from "../../utilities/emailTemplate/resetPasswordTemplate";
import Handlebars from "handlebars";

export const forgetPassword = async (entry) => {
  let {
    body: { email, redirectUrl },
  } = entry;

  email = email.toLowerCase();

  const resetPasswordToken = getUniqueId();

  let userData = await dbService.findOneRecord(
    "UserModel",
    { email: email },
    { _id: 1, firstName: 1, isSocial: 1 }
  );

  if (!userData) throw new Error("Email address not found");

  if (userData?.isSocial)
    throw new Error(
      "This account signup with social login. Please use social login option."
    );

  await dbService.updateOneRecords(
    "UserModel",
    {
      _id: userData?._id,
    },
    {
      resetPasswordToken: resetPasswordToken,
    }
  );

  let context = {
    name: userData?.firstName,
    verificationLink: `${redirectUrl}/${email}/${resetPasswordToken}`,
  };

  var templateData = Handlebars.compile(RESET_PASSWORD_TEMPLATE);
  var html = templateData(context);

  await sendEmail({
    email: email,
    subject: "Identable Reset Password Link",
    body: html,
  });

  return "Reset password link sent to your email address";
};
