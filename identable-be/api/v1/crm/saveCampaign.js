import { Joi } from "utilities/schemaValidate";

export const saveCampaignSchema = Joi.object({
  campaignType: Joi.number().required().label("campaignType"),
  campaignName: Joi.string().required().label("campaignName"),
  searchUrl: Joi.string().required().label("searchUrl"),
  isPremiumAccount: Joi.boolean().default(false).label("isPremiumAccount"),
  isInMailDiscover: Joi.boolean().default(false).label("isInMailDiscover"),
  isAlreadyTalkedPeople: Joi.boolean()
    .default(false)
    .label("isAlreadyTalkedPeople"),
});
