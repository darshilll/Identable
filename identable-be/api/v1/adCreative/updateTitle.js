import { Joi } from "utilities/schemaValidate";

export const updateTitleSchema = Joi.object({
  templateId: Joi.string().required().label("templateId"),
  title: Joi.string().required().label("title"),
});
