import { Joi } from "utilities/schemaValidate";

export const updatePasswordSchema = Joi.object({
  email: Joi.string().required().label("email"),
  password: Joi.string().required().label("password"),
  token: Joi.string().required().label("token"),
});
