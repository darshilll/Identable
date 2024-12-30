import { Joi } from "utilities/schemaValidate";

export const savePageAccessSchema = Joi.object({
  pageArray: Joi.array().required().label("pageArray"),
});
