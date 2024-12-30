import { Joi } from "utilities/schemaValidate";

export const commonPromptSchema = Joi.object({
  promptAction: Joi.string().required().label("promptAction"),
  designation: Joi.string().allow(null, "").label("designation"),
  keyword: Joi.array().label("keyword"),
  youAre: Joi.string().label("youAre"),
  pageId: Joi.string().label("pageId"),
  pointOfView: Joi.string().allow(null, "").label("pointOfView"),
  campaignTopic: Joi.string().allow(null, "").label("campaignTopic"),  
  carouselTopic: Joi.string().allow(null, "").label("carouselTopic"),  
});
