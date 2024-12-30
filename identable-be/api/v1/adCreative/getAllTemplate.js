import { Joi } from "utilities/schemaValidate";

export const getAllTemplateSchema = Joi.object({
  searchText: Joi.string().allow(null, "").default("").label("searchText"),
  sortMode: Joi.boolean().default(false).label("sortMode"),
  isTemplate: Joi.boolean().default(false).label("isTemplate"),
});
