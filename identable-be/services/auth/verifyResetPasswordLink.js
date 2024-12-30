import dbService from "../../utilities/dbService";
import { encryptpassword } from "../../utilities/encryptpassword";

export const verifyResetPasswordLink = async (entry) => {
  let {
    body: { email, token },
  } = entry;

  email = email.toLowerCase();

  let userData = await dbService.findOneRecord(
    "UserModel",
    { email: email, resetPasswordToken: token },
    { _id: 1 }
  );
  if (!userData) throw new Error("Invalid reset password link");
  return "Verification link is valid";
};
