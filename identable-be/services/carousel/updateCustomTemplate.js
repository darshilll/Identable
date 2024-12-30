import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;

export const updateCustomTemplate = async (entry) => {
  let {
    body: {
      templateId,
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

  let carouselData = await dbService.findOneAndUpdateRecord(
    "carouselCustomTemplateModel",
    { _id: ObjectId(templateId) },
    {
      $set: {
        carouselSetting,
        mediaUrl,
        carouselName,
        carouselIdea,
        carouselLength,
        isTemplate,
        status,
        userId: ObjectId(_id),
        updatedAt: Date.now(),
      },
    },
    { new: true, upsert: true }
  );

  return carouselData;
};
