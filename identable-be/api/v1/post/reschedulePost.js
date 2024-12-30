import { Joi } from "utilities/schemaValidate";

export const reschedulePostSchema = Joi.object({
  scheduleDateTime: Joi.number().required().label("scheduleDateTime"),
  timeSlot: Joi.string().required().label("timeSlot"),
  timePeriod: Joi.string().required().label("timePeriod"),
  postId: Joi.string().required().label("postId"),
});
