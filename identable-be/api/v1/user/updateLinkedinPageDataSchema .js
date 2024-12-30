import { Joi } from "utilities/schemaValidate";

export const updateLinkedinPageDataSchema = Joi.object({
  image:  Joi.string().optional().label("image"),
  coverPhoto: Joi.string().optional().label("coverPhoto"),
  profileUrl: Joi.string().optional().label("profileUrl"),
  });
