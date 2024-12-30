import { Joi } from "utilities/schemaValidate";

export const contentAnalyzeSchema = Joi.object({
  content: Joi.string().required().label("content"),
});
