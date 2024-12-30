import { Joi } from "utilities/schemaValidate";

export const getArticleIdeaSchema = Joi.object({
  goal: Joi.string().required().label("goal"),
});
