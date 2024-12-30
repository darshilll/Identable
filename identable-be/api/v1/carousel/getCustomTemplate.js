import { Joi } from "utilities/schemaValidate";

export const getCustomTemplateSchema = Joi.object({
  templateId: Joi.string().required().label("templateId"),
});
