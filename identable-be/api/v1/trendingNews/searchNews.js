import { Joi } from "utilities/schemaValidate";

export const searchNewsSchema = Joi.object({
  searchKeyword: Joi.string().required().label("searchKeyword"),
});
