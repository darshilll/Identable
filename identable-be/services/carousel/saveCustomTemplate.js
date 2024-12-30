import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;

export const saveCustomTemplate = async (entry) => {
  let {
    body: {
      carouselSetting,
      mediaUrl,
      carouselName,
      carouselIdea,
      carouselLength,
      isTemplate,
      status,
    },
    user: { _id },
  } = entry;

  let carouselData = await dbService.createOneRecord(
    "carouselCustomTemplateModel",
    {
      carouselSetting,
      mediaUrl,
      carouselName,
      carouselIdea,
      carouselLength,
      isTemplate,
      status,
      userId: ObjectId(_id),
      createdAt: Date.now(),
    }
  );

  return carouselData;
};
