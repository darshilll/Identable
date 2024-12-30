import { Joi } from "utilities/schemaValidate";

export const generateDIYPostPromptSchema = Joi.object({
  postContent: Joi.string().required().label("postContent"),
});
