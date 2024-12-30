import { Joi } from "utilities/schemaValidate";

export const checkEmailSchema = Joi.object({
  email: Joi.string().required().label("email"),
  isForgotPassword: Joi.boolean().default(false).label("isForgotPassword"),
});
