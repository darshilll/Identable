import { Joi } from "utilities/schemaValidate";

export const getPostByIdSchema = Joi.object({
  postId: Joi.string().required().label("postId"),
});
