import { Joi } from "utilities/schemaValidate";

export const addThemeSchema = Joi.object({
  backgroundColor: Joi.string().allow("", null).label("backgroundColor"),
  fontColor: Joi.string().required().label("fontColor"),
  signatureAlign: Joi.string().required().label("signatureAlign"),
  backgroundMedia: Joi.string().allow("", null).label("backgroundMedia"),
});
