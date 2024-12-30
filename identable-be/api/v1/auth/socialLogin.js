import { Joi } from "utilities/schemaValidate";

export const socialLoginSchema = Joi.object({
  code: Joi.string().required().label("code"),
});
