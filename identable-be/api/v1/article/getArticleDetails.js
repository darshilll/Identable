import { Joi } from "utilities/schemaValidate";

export const getArticleDetailsSchema = Joi.object({
  articleId: Joi.string().required().label("articleId"),
});
