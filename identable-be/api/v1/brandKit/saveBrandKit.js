import { Joi } from "utilities/schemaValidate";

export const saveBrandKitSchema = Joi.object({
  imageUrl: Joi.string().required().label("imageUrl"),
  logoUrl: Joi.string().required().label("logoUrl"),
  primaryColor: Joi.string().required().label("primaryColor"),
  secondaryColor: Joi.string().required().label("secondaryColor"),
  titleFont: Joi.string().required().label("titleFont"),
  bodyFont: Joi.string().required().label("bodyFont"),
  accent1Color: Joi.string().allow("", null).label("accent1Color"),
  accent2Color: Joi.string().allow("", null).label("accent2Color"),
  website: Joi.string().allow("", null).label("website"),
  contact: Joi.string().allow("", null).label("contact"),
});
