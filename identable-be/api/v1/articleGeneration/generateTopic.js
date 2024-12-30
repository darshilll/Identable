import { Joi } from "utilities/schemaValidate";

export const generateTopicSchema = Joi.object({
  topic: Joi.string().required().label("topic"),
});
