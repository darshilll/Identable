import { Joi } from "utilities/schemaValidate";

export const carouselGenerateSchema = Joi.object({
  slideLength: Joi.number().required().label("length"),
  themeContentType:Joi.string().required().label("themeContentType"),
  topic: Joi.string().required().label("topic")
});
