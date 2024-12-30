import { Joi } from "utilities/schemaValidate";

export const postCommentSchema = Joi.object({
  prospect_id: Joi.string().required().label("prospect_id"),
  post_content: Joi.string().required().label("post_content"),
});
