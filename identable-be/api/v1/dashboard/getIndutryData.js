import { Joi } from "utilities/schemaValidate";

export const getIndutryDataSchema = Joi.object({
  pageId: Joi.string().required().label("pageId"),
});
