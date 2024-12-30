import { Joi } from "utilities/schemaValidate";

export const getCampaignPostsSchema = Joi.object({
  campaignId: Joi.string().required().label("campaignId"),
});
