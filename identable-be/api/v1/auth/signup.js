import { Joi } from "utilities/schemaValidate";

export const signupSchema = Joi.object({
  email: Joi.string().required().label("email"),
  password: Joi.string().required().label("password"),
  name: Joi.string().required().label("name"),
  otp: Joi.string().required().label("otp"),
});
