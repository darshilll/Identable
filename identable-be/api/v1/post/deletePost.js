import { Joi } from "utilities/schemaValidate";

export const deletePostSchema = Joi.object({
  postId: Joi.string().required().label("postId"),
});
