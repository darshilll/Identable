import { Joi } from "utilities/schemaValidate";

export const getProspectListSchema = Joi.object({
  limit: Joi.number().default(10).label("limit"),
  page: Joi.number().default(1).label("page"),
  type: Joi.string().required().label("type"),
  searchText: Joi.string().allow(null, "").default("").label("searchText"),
  campaignId: Joi.string().allow(null, "").default("").label("campaignId"),  
});
