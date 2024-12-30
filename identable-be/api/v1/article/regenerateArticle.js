import { Joi } from "utilities/schemaValidate";

export const regenerateArticleSchema = Joi.object({
  topic: Joi.string().required().label("topic"),
  keywords: Joi.string().required().label("keywords"),
  goal: Joi.string().required().label("goal"),
  headline: Joi.string().required().label("headline"),
  headingData: Joi.array().required().label("headingData"),
  youtubeVideos: Joi.array().label("youtubeVideos"),
  authorityLinks: Joi.array().label("authorityLinks"),
  isFAQ: Joi.boolean().label("isFAQ"),
  isConclusion: Joi.boolean().label("isConclusion"),
  isCTA: Joi.boolean().label("isCTA"),
  language: Joi.string().required().label("language"),
  length: Joi.string().required().label("length"),
  factualData: Joi.string().required().label("goal"),
  imageCount: Joi.number().required().label("imageCount"),
  imageSource: Joi.string().required().label("imageSource"),
  imageOrientation: Joi.string().required().label("imageOrientation"),
  isAltTag: Joi.boolean().label("isAltTag"),
});
