import { Joi } from "utilities/schemaValidate";

export const saveIntegrationSchema = Joi.object({
  userId: Joi.string().allow(null, "").label("userId"),
  profileData: Joi.object().allow(null).label("profileData"),
  pageData: Joi.array().allow(null).label("pageData"),
});
