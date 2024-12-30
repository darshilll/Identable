import { Joi } from "utilities/schemaValidate";

export const saveSocialSellingIndexSchema = Joi.object({
  page_id: Joi.string().required().label("page_id"),
  user_id: Joi.string().required().label("user_id"),
  ssi_data: Joi.string().required().label("ssi_data"),
});
