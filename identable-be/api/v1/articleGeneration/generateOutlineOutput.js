import { Joi } from "utilities/schemaValidate";

export const generateOutlineOutputSchema = Joi.object({
  title: Joi.string().required().label("title"),
  description: Joi.string().required().label("description"),
  strategicKeywords: Joi.string().required().label("strategicKeywords"),
  searchIntent: Joi.string().required().label("searchIntent"),
});
