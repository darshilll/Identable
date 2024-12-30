import { Joi } from "utilities/schemaValidate";

export const saveAISettingSchema = Joi.object({
  chatGPTVersion: Joi.string().required().label("chatGPTVersion"),
  advanceSetting: Joi.array().required().label("advanceSetting"),
});
