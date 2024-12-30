import { Joi } from "utilities/schemaValidate";

export const changeProfileSchema = Joi.object({
  pageId: Joi.string().required().label("pageId"),
});
