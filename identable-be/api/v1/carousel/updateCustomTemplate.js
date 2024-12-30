import { Joi } from "utilities/schemaValidate";

export const updateCustomTemplateSchema = Joi.object({
  templateId: Joi.string().required().label("templateId"),
  carouselSetting: Joi.object().allow(null).label("carouselSetting"),
  mediaUrl: Joi.string().required().label("mediaUrl"),
  carouselName: Joi.string().required().label("carouselName"),
  carouselIdea: Joi.string().allow("", null).label("carouselIdea"),
  carouselLength: Joi.number().required().label("carouselLength"),
  isTemplate: Joi.boolean().default(false).label("isTemplate"),
  status: Joi.string().required().label("status"),
});
