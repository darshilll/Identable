import bcrypt from "bcryptjs";

export const decryptPassword = async (password, oldPassword) => {
  const matchPassword = await bcrypt.compare(password, oldPassword);
  return matchPassword;
};
