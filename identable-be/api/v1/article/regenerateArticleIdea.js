import { Joi } from "utilities/schemaValidate";

export const regenerateArticleIdeaSchema = Joi.object({
  goal: Joi.string().required().label("goal"),
});
