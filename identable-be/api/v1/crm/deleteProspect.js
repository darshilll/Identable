import { Joi } from "utilities/schemaValidate";

export const deleteProspectSchema = Joi.object({
  prospectId: Joi.string().required().label("prospectId"),
});
