import { Joi } from "utilities/schemaValidate";

export const loginSchema = Joi.object({
  email: Joi.string().required().label("email"),
  password: Joi.string().required().label("password"),
});
