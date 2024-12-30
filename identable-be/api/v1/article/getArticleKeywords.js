import { Joi } from "utilities/schemaValidate";

export const getArticleKeywordsSchema = Joi.object({
  topic: Joi.string().required().label("topic"),
});
