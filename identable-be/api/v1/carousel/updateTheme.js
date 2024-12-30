import { Joi } from "utilities/schemaValidate";

export const updateThemeSchema = Joi.object({
  pageId: Joi.string().required().label("pageId"),
});
