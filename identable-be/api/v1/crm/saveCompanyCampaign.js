import { Joi } from "utilities/schemaValidate";

export const saveCompanyCampaignSchema = Joi.object({
  campaignName: Joi.string().required().label("campaignName"),
  connectedIds: Joi.array().required().label("connectedIds"),
  campaignType: Joi.number().allow(null, "").label("campaignType"),
  searchUrl: Joi.string().allow(null, "").label("searchUrl"),
});
