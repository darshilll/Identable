import { Joi } from "utilities/schemaValidate";

export const updateCarouselNameSchema = Joi.object({
  templateId: Joi.string().required().label("templateId"),
  carouselName: Joi.string().required().label("carouselName"),
});
