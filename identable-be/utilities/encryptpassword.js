import bcrypt from "bcryptjs";

export const encryptpassword = async (password) => {
  const salt = await bcrypt.genSaltSync(10);
  const hashPassword = await bcrypt.hashSync(password, salt);
  return hashPassword;
};
