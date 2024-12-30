import { Joi } from "utilities/schemaValidate";

export const updateArticleSchema = Joi.object({
  topic: Joi.string().label("topic"),
  keywords: Joi.string().label("keywords"),
  goal: Joi.string().label("goal"),
  headline: Joi.string().label("headline"),
  content: Joi.string().label("content"),
  bannerImage: Joi.string().label("bannerImage"),
  articleId: Joi.string().required().label("articleId"),
  bannerImageSetting: Joi.object().label("bannerImageSetting"),
  bannerImage: Joi.string().label("bannerImage"),
  titleTag: Joi.string().label("titleTag"),
  metaTag: Joi.string().label("metaTag"),
});
