import { Joi } from "utilities/schemaValidate";

export const setDefaultCardSchema = Joi.object({
  cardSourceId: Joi.string().required().label("cardSourceId"),
});
