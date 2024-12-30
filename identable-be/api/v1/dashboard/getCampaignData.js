import { Joi } from "utilities/schemaValidate";

export const getCampaignDataSchema = Joi.object({
  pageId: Joi.string().required().label("pageId"),
});
