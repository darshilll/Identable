import { Joi } from "utilities/schemaValidate";

export const generateAdCreativeContentSchema = Joi.object({
  topic: Joi.string().required().label("topic"),
  content: Joi.string().required().label("content"),
});
