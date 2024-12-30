import { Joi } from "utilities/schemaValidate";

export const generateCarouselSlideSchema = Joi.object({
  topic: Joi.string().required().label("topic"),
  slideType: Joi.string().required().label("slideType"),
});
