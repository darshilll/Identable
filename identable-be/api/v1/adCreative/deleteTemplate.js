import { Joi } from "utilities/schemaValidate";

export const deleteCustomTemplateSchema = Joi.object({
  templateId: Joi.string().required().label("templateId"),
});
