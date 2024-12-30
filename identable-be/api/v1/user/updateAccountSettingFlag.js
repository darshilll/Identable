import { Joi } from "utilities/schemaValidate";

export const updateAccountSettingFlagSchema = Joi.object({
  isGeneral: Joi.boolean().label("isGeneral"),
  isIntegration: Joi.boolean().label("isIntegration"),
  isAISetting: Joi.boolean().label("isAISetting"),
  isBilling: Joi.boolean().label("isBilling"),
  isBrandInfo : Joi.boolean().label("isBrandInfo"),
  isAutoAiSetting : Joi.boolean().label("isAutoAiSetting")
});
