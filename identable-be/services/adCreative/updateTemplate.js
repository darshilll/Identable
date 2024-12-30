import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;

export const updateTemplate = async (entry) => {
  let {
    body: { templateSetting, templateId, mediaUrl, title, idea, isTemplate },
    user: { _id },
  } = entry;

  let data = await dbService.findOneAndUpdateRecord(
    "AdCreativeCustomTemplateModel",
    { _id: ObjectId(templateId) },
    {
      $set: {
        templateSetting,
        mediaUrl,
        title,
        idea,
        isTemplate,
        userId: ObjectId(_id),
        updatedAt: Date.now(),
      },
    },
    { new: true, upsert: true }
  );

  return data;
};
