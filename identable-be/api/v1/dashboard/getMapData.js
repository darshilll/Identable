import { Joi } from "utilities/schemaValidate";

export const getMapDataSchema = Joi.object({
  pageId: Joi.string().required().label("pageId"),
});
