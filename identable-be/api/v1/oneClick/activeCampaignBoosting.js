import { Joi } from "utilities/schemaValidate";

export const activeCampaignBoostingSchema = Joi.object({
  campaignId: Joi.string().required().label("campaignId"),
});
