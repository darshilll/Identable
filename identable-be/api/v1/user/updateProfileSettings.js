import { Joi } from "utilities/schemaValidate";

export const updateProfileSettingSchema = Joi.object({
  action: Joi.string().required().label("action"),
});
