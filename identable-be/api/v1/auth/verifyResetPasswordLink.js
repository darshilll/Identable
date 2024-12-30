import { Joi } from "utilities/schemaValidate";

export const verifyResetPasswordLinkSchema = Joi.object({
  email: Joi.string().required().label("email"),
  token: Joi.string().required().label("token"),
});
