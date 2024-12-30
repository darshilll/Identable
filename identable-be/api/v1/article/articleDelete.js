import { Joi } from "utilities/schemaValidate";

export const articleDeleteSchema = Joi.object({
  articleId: Joi.string().required().label("articleId"),
});
