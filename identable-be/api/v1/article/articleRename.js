import { Joi } from "utilities/schemaValidate";

export const articleRenameSchema = Joi.object({
  articleTitle: Joi.string().required().label("articleTitle"),
  articleId: Joi.string().required().label("articleId"),
});
