import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;

export const getCustomTemplate = async (entry) => {
  let {
    body: { templateId },
    user: { _id },
  } = entry;

  let carouselData = await dbService.findOneRecord(
    "carouselCustomTemplateModel",
    {
      userId: _id,
      _id: ObjectId(templateId),
      isDeleted: false,
    }
  );

  return carouselData;
};
