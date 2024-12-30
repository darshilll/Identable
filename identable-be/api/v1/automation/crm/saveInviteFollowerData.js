import { Joi } from "utilities/schemaValidate";

export const saveInviteFollowerDataSchema = Joi.object({
  page_id: Joi.string().required().label("page_id"),
  user_id: Joi.string().required().label("user_id"),
  campaign_id: Joi.string().required().label("campaign_id"),
  invited_prospects: Joi.array().required().label("invited_prospects"),
  uninvited_prospects: Joi.array().required().label("uninvited_prospects"),
});
