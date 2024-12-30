import { Joi } from "utilities/schemaValidate";

export const generateAIImageSchema = Joi.object({
  topic: Joi.string().allow("", null).label("topic"),
  size: Joi.string().allow("", null).label("size"),
});
