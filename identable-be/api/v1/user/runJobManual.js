import { Joi } from "utilities/schemaValidate";

export const runJobManualSchema = Joi.object({
  userId: Joi.string().required().label("userId"),
  jobType: Joi.string().required().label("jobType"),
});
