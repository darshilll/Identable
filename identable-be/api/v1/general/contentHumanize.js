import { Joi } from "utilities/schemaValidate";

export const contentHumanizeSchema = Joi.object({
  content: Joi.string().required().label("content"),
});
