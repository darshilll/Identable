import { Joi } from "utilities/schemaValidate";

export const checkoutSessionSchema = Joi.object({
  planId: Joi.string().required().label("planId"),
  recurringType: Joi.string().required().label("recurringType"),
});
