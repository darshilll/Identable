import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;

export const updateTitle = async (entry) => {
  let {
    body: { templateId, title },
    user: { _id },
  } = entry;
  let carouselData = await dbService.findOneAndUpdateRecord(
    "AdCreativeCustomTemplateModel",
    {
      userId: _id,
      _id: ObjectId(templateId),
      isDeleted: false,
    },
    {
      $set: { title: title },
    }
  );

  return "Title updated.";
};
