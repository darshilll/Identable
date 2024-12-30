import { Joi } from "utilities/schemaValidate";

export const updateCampaignStatusSchema = Joi.object({
  campaignId: Joi.string().required().label("campaignId"),
  isActive: Joi.boolean().required().label("isActive"),
});
