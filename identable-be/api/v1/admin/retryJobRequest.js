import { Joi } from "utilities/schemaValidate";

export const retryJobRequestSchema = Joi.object({
  jobRequestId: Joi.string().required().label("jobRequestId"),
});
