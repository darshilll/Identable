import { Joi } from "utilities/schemaValidate";

export const savePostAnalyticsDataSchema = Joi.object({
  userId: Joi.string().required().label("userId"),
  pageId: Joi.string().required().label("pageId"),
  postAnalyticsData: Joi.array().required().label("postAnalyticsData"),
});
