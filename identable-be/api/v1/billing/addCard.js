import { Joi } from "utilities/schemaValidate";

export const addCardSchema = Joi.object({
  cardToken: Joi.string().required().label("cardToken"),
  isDefaultCard: Joi.boolean().default(false).label("isDefaultCard"),
});
