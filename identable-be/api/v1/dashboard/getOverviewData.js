import { Joi } from "utilities/schemaValidate";

export const getOverviewDataSchema = Joi.object({
  pageId: Joi.string().required().label("pageId"),
  startDate: Joi.number().required().label("startDate"),
  endDate: Joi.number().label("endDate"),
});
