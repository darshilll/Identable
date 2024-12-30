import { Joi } from "utilities/schemaValidate";

export const getAllPostListSchema = Joi.object({
  pageId: Joi.string().required().label("pageId"),
  limit: Joi.number().default(10).label("limit"),
  page: Joi.number().default(1).label("page"),
  searchText: Joi.string().label("searchText"),
  sortByy: Joi.string().default("name").label("sortBy"),
  sortMode: Joi.number().default(1).label("sortMode"),
  startDate: Joi.number().required().label("startDate"),
  endDate: Joi.number().label("endDate"),
});
