import { Joi } from "utilities/schemaValidate";

export const getSEOScoreFeedbackSchema = Joi.object({
  topic: Joi.string().required().label("topic"),
  headline: Joi.string().required().label("headline"),
  content: Joi.string().required().label("content"),
  keywords: Joi.string().required().label("keywords"),
});
