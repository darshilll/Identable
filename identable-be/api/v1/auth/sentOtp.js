import { Joi } from "utilities/schemaValidate";

export const sentOtpSchema = Joi.object({
  email: Joi.string().required().label("email"),
  name: Joi.string().allow(null, "").label("name"),
});
