import { Joi } from "utilities/schemaValidate";

export const initiateConnectionStatusSchema = Joi.object({
  prospect_id: Joi.string().required().label("prospect_id"),
  action_type: Joi.string().required().label("action_type"),
  status: Joi.any().required().label("status"),
  error: Joi.any().label("error"),
});
