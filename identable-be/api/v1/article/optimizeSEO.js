import { Joi } from "utilities/schemaValidate";

export const optimizeSEOSchema = Joi.object({
  topic: Joi.string().required().label("topic"),
  keywords: Joi.string().required().label("keywords"),
  headline: Joi.string().required().label("headline"),
  content: Joi.string().required().label("content"),
  feedbackData: Joi.any().required().label("feedbackData"),
});
