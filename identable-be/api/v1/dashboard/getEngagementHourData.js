import { Joi } from "utilities/schemaValidate";

export const getEngagementHourDataSchema = Joi.object({
  pageId: Joi.string().required().label("pageId"),
});
