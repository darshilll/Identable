import { Joi } from "utilities/schemaValidate";

export const getTemplateSchema = Joi.object({
  templateId: Joi.string().required().label("templateId"),
});
