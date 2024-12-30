import { Joi } from "utilities/schemaValidate";

export const getLinkPreviewSchema = Joi.object({
  url: Joi.string().required().label("url"),
});
