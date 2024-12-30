import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;

export const deleteCustomTemplate = async (entry) => {
  let {
    body: { templateId },
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
      $set: { isDeleted: true },
    }
  );

  return "Template Deleted.";
};
