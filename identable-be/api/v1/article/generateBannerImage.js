import { Joi } from "utilities/schemaValidate";

export const generateBannerImageSchema = Joi.object({
  topic: Joi.string().required().label("topic"),
  keywords: Joi.string().required().label("keywords"),
  goal: Joi.string().required().label("goal"),
  headline: Joi.string().required().label("headline"),
});
