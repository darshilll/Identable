import { Joi } from "utilities/schemaValidate";

export const saveLinkedinCookiesSchema = Joi.object({
  cookies: Joi.string().required().label("cookies"),
});
