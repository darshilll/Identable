import { Joi } from "utilities/schemaValidate";

export const getInspireMeSchema = Joi.object({
  contentType: Joi.string().required().label("contentType"),
});
