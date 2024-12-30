import { Joi } from "utilities/schemaValidate";

export const generateArticleSchema = Joi.object({
  title: Joi.string().required().label("title"),
  headingData: Joi.array().required().label("headingData"),
  conclusion: Joi.string().required().label("conclusion"),
});
