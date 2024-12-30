import { Joi } from "utilities/schemaValidate";

export const generateSubTopicSchema = Joi.object({
  topic: Joi.string().required().label("topic"),
  keywords: Joi.string().required().label("keywords"),
  goal: Joi.string().required().label("goal"),
  headline: Joi.string().required().label("headline"),
  h2: Joi.string().required().label("h2"),
  h3: Joi.string().required().label("h3"),
});
