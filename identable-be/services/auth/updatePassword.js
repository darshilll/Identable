import dbService from "../../utilities/dbService";
import { encryptpassword } from "../../utilities/encryptpassword";

export const updatePassword = async (entry) => {
  let {
    body: { email, password, token },
  } = entry;

  email = email.toLowerCase();

  let userData = await dbService.findOneRecord(
    "UserModel",
    { email: email, resetPasswordToken: token },
    { _id: 1 }
  );

  if (!userData) throw new Error("Invalid reset password link");

  let encryptpassword1 = await encryptpassword(password);

  await dbService.updateOneRecords(
    "UserModel",
    {
      _id: userData?._id,
    },
    {
      password: encryptpassword1,
      resetPasswordToken: "",
      loginToken: "",
    }
  );

  return "Password changed successfully";
};
