import { Joi } from "utilities/schemaValidate";

export const editPostPromptSchema = Joi.object({
  promptAction: Joi.string().required().label("promptAction"),
  postContent: Joi.string().required().label("postContent"),
  rewriteType: Joi.string().label("rewriteType"),
});
