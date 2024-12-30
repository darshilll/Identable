import { Joi } from "utilities/schemaValidate";

export const updateCookieStatusSchema = Joi.object({
  userId: Joi.string().required().label("userId"),
  status: Joi.string().required().label("status"),
});
