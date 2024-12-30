import { Joi } from "utilities/schemaValidate";

export const saveLinkedinConnectionDataSchema = Joi.object({
  user_id: Joi.string().required().label("user_id"),
  page_id: Joi.string().required().label("page_id"),
  connections: Joi.array().required().label("connections"),
});
