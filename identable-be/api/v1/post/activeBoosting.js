import { Joi } from "utilities/schemaValidate";

export const activeBoostingSchema = Joi.object({
  postId: Joi.string().allow("", null).label("postId"),
  isBoosting: Joi.boolean().default(false).label("isBoosting"),
  likeCount: Joi.number().default(0).label("likeCount"),
});
