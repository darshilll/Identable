import { Joi } from "utilities/schemaValidate";

export const getJobRequestListSchema = Joi.object({
  limit: Joi.number().default(10).label("limit"),
  page: Joi.number().default(1).label("page"),
  jobType: Joi.string().allow(null, "").label("jobType"),
  status: Joi.string().allow(null, "").label("status"),
  toDate: Joi.number().allow(null, "").label("toDate"),
  fromDate: Joi.number().allow(null, "").label("fromDate"),
});
