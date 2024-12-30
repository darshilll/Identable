import { Joi } from "utilities/schemaValidate";

export const contentMarkedSchema = Joi.object({
  status: Joi.string().required().label("status"),
  content: Joi.string().required().label("content"),
});
