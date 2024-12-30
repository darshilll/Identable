import { Joi } from "utilities/schemaValidate";

export const saveLinkedinFollowersDataSchema = Joi.object({
  user_id: Joi.string().required().label("user_id"),
  page_id: Joi.string().required().label("page_id"),
  followers: Joi.array().required().label("followers"),
});
