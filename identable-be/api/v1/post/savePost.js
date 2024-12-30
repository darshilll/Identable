import { Joi } from "utilities/schemaValidate";

export const savePostSchema = Joi.object({
  scheduleDateTime: Joi.number().allow("", null).label("scheduleDateTime"),
  postBody: Joi.string().allow("", null).label("postBody"),
  timeSlot: Joi.string().allow("", null).label("timeSlot"),
  timePeriod: Joi.string().allow("", null).label("timePeriod"),
  postMedia: Joi.string().allow("", null).label("postMedia"),
  postMediaType: Joi.string().allow("", null).label("postMediaType"),
  generatedType: Joi.string().required().label("generatedType"),
  status: Joi.string().required().label("status"),
  postId: Joi.string().allow("", null).label("postId"),
  generatedTypeId: Joi.string().allow("", null).label("generatedTypeId"),
  articleHeadline: Joi.string().allow("", null).label("articleHeadline"),
  articleTitle: Joi.string().allow("", null).label("articleTitle"),
  isBoosting: Joi.boolean().default(false).label("isBoosting"),
  likeCount: Joi.number().default(0).label("likeCount"),
  documentDescription: Joi.string().allow("", null).label("documentDescription"),
  carouselTemplate: Joi.array().allow(null).label("carouselTemplate"),
  carouselSetting: Joi.object().allow(null).label("carouselSetting"),
  carouselId: Joi.string().allow(null).label("carouselId"),
  articleId: Joi.string().allow("", null).label("articleId"),
});
