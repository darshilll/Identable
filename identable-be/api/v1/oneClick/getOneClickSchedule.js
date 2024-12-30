import { Joi } from "utilities/schemaValidate";

export const getOneClickScheduleSchema = Joi.object({
  topic: Joi.string().required().label("topic"),
  dailyPost: Joi.number().required().label("dailyPost"),
  isWeekendInclude: Joi.boolean().required().label("isWeekendInclude"),
  duration: Joi.string().required().label("duration"),

  includeContentType: Joi.array().required().label("includeContentType"),
  goal: Joi.string().required().label("goal"),
  keyword: Joi.array().required().label("keyword"),

  isABVersion: Joi.boolean().required().label("isABVersion"),
  themeVersionA: Joi.string().allow("", null).label("themeVersionA"),
  themeVersionB: Joi.string().allow("", null).label("themeVersionB"),
  isBrandKit: Joi.boolean().required().label("isBrandKit"),

  isStartImmediately: Joi.boolean().required().label("isStartImmediately"),
  startDate: Joi.number().required().label("startDate"),

  color: Joi.string().required().label("color"),

  imageStyle: Joi.string().required().label("imageStyle"),
  videoCollection: Joi.string().required().label("videoCollection"),
  videoRatio: Joi.string().required().label("videoRatio"),
  videoLength: Joi.string().required().label("videoLength"),
  videoVoice: Joi.string().required().label("videoVoice"),

  carouselTemplate: Joi.string().required().label("carouselTemplate"),
  carouselId: Joi.string().allow(null, "").label("carouselId"),
});
