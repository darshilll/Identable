import { Joi } from "utilities/schemaValidate";

export const getConnectedListSchema = Joi.object({
  limit: Joi.number().default(10).label("limit"),
  page: Joi.number().default(1).label("page"),
  searchText: Joi.string().allow(null, "").default("").label("searchText"),
});
