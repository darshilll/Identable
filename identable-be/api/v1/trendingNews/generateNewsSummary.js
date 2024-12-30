import { Joi } from "utilities/schemaValidate";

export const generateNewsSummarySchema = Joi.object({
  title: Joi.string().required().label("title"),
  content: Joi.string().required().label("content"),
  url: Joi.string().required().label("url"),
});
