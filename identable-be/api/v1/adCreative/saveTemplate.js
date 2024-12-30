import { Joi } from "utilities/schemaValidate";

export const saveTemplateSchema = Joi.object({
  templateSetting: Joi.object().allow(null).label("adCreativeSetting"),
  mediaUrl: Joi.string().required().label("mediaUrl"),
  title: Joi.string().required().label("title"),
  idea: Joi.string().allow("", null).label("idea"),
  isTemplate: Joi.boolean().default(false).label("isTemplate"),
});
