import { Joi } from "utilities/schemaValidate";

export const updateCardSchema = Joi.object({
  cardSourceId: Joi.string().required().label("cardSourceId"),
  isDefaultCard: Joi.boolean().default(false).label("isDefaultCard"),
  addressZip: Joi.string().required().label("addressZip"),
  expYear: Joi.string().required().label("expYear"),
  expMonth: Joi.string().required().label("expMonth"),
});
