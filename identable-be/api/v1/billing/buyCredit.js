import { Joi } from "utilities/schemaValidate";

export const buyCreditSchema = Joi.object({
  credit: Joi.number().required().label("credit"),
  successUrl: Joi.string().required().label("successUrl"),
  cancelUrl: Joi.string().required().label("cancelUrl"),
});
