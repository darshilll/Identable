import { Joi } from "utilities/schemaValidate";

export const savePostDataSchema = Joi.object({
  userId: Joi.string().required().label("userId"),
  pageId: Joi.string().required().label("pageId"),
  postData: Joi.array().required().label("postData"),
});
