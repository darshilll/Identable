import { Joi } from "utilities/schemaValidate";

export const getCampaignBoostCreditSchema = Joi.object({
  campaignId: Joi.string().required().label("campaignId"),
});
