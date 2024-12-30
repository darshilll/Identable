import { Joi } from "utilities/schemaValidate";

export const getArticleListSchema = Joi.object({
  searchText: Joi.string().allow(null, "").default("").label("searchText"),
  sortMode: Joi.boolean().default(false).label("sortMode"),
});
