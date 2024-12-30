import { Joi } from "utilities/schemaValidate";

export const generateCreativeSchema = Joi.object({
  topic: Joi.string().required().label("topic"),
  generatedImageType: Joi.string().allow("", null).label("generatedImageType"),
});
