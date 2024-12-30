import { Joi } from "utilities/schemaValidate";

export const deleteCardSchema = Joi.object({
  cardSourceId: Joi.string().required().label("cardSourceId"),
});
