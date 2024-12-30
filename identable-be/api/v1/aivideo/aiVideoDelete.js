import { Joi } from "utilities/schemaValidate";

export const aiVideoDeleteSchema = Joi.object({
  videoId: Joi.string().required().label("videoId"),
});
