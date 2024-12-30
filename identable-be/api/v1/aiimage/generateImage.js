import { Joi } from "utilities/schemaValidate";

export const generateImageSchema = Joi.object({
  topic: Joi.string().required().label("topic"),
  size: Joi.string().allow("", null).label("size"),
  imageStyle: Joi.string().required().label("imageStyle"),
});
