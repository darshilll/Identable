import { Joi } from "utilities/schemaValidate";

export const saveAivideoSchema = Joi.object({
  collection: Joi.string().required().label("collection"),
  idea: Joi.string().allow("", null).label("idea"),
  url: Joi.string().allow("", null).label("url"),
  color: Joi.string().required().label("color"),
  ratio: Joi.string().required().label("ratio"),
  length: Joi.string().required().label("length"),
  voice: Joi.string().required().label("voice"),
});
