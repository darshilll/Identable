import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;

export const updateCarouselName = async (entry) => {
  let {
    body: { templateId, carouselName },
    user: { _id },
  } = entry;

  let carouselData = await dbService.findOneAndUpdateRecord(
    "carouselCustomTemplateModel",
    {
      userId: _id,
      _id: ObjectId(templateId),
      isDeleted: false,
    },
    {
      $set: { carouselName: carouselName },
    }
  );

  return "carousel name updated.";
};
