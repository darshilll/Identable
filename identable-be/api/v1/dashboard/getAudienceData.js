import { Joi } from "utilities/schemaValidate";

export const getAudienceDataSchema = Joi.object({
  pageId: Joi.string().required().label("pageId"),
  startDate: Joi.number().required().label("startDate"),
  endDate: Joi.number().label("endDate"),
});
