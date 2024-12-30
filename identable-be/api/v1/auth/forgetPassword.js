import { Joi } from "utilities/schemaValidate";

export const forgetPasswordSchema = Joi.object({
  email: Joi.string().required().label("email"),
  redirectUrl: Joi.string().required().label("redirectUrl"),  
});
