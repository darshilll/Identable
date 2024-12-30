import { Joi } from "utilities/schemaValidate";

export const getPostSchema = Joi.object({
  startDate: Joi.number().required().label("startDate"),
  endDate: Joi.number().required().label("endDate"),
  status: Joi.string().allow("", null).label("status"),
});
