import { Joi } from "utilities/schemaValidate";

export const generateCarouselSchema = Joi.object({
  length: Joi.number().required().label("length"),
  topic: Joi.string().required().label("topic"),
  promtTheme: Joi.string().required().label("promtTheme"),
});
