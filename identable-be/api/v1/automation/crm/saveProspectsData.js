import { Joi } from "utilities/schemaValidate";

export const saveProspectsDataSchema = Joi.object({
  page_id: Joi.string().required().label("page_id"),
  user_id: Joi.string().required().label("user_id"),
  campaign_id: Joi.string().required().label("campaign_id"),
  prospects: Joi.array().required().label("prospects"),
});
