import { Joi } from "utilities/schemaValidate";

export const getMediaListSchema = Joi.object({
  limit: Joi.number().default(10).label("limit"),
  page: Joi.number().default(1).label("page"),
  mediaType: Joi.string().label("mediaType"),
});
