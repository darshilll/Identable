import { Joi } from "utilities/schemaValidate";

export const getAgeGenderDataSchema = Joi.object({
  pageId: Joi.string().required().label("pageId"),
});
