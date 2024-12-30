import { Joi } from "utilities/schemaValidate";

export const verifyOtpSchema = Joi.object({
  email: Joi.string().required().label("email"),
  otp: Joi.string().required().label("otp"),
});
