import { Joi } from "utilities/schemaValidate";

export const rewritePostPromptSchema = Joi.object({
  postContent: Joi.string().required().label("postContent"),
});
