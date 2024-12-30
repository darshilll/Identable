import { Joi } from "utilities/schemaValidate";

export const saveLinkedinUserDataSchema = Joi.object({
  user_id: Joi.string().required().label("user_id"),
  page_id: Joi.string().required().label("page_id"),
  data: Joi.array().required().label("data"),
});
