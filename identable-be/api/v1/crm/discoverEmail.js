import { Joi } from "utilities/schemaValidate";

export const discoverEmailSchema = Joi.object({
  connectionId: Joi.string().required().label("connectionId"),
  isProspect: Joi.boolean().required().label("isProspect"),
});
