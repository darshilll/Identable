import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;

export const saveTemplate = async (entry) => {
  let {
    body: { templateSetting, mediaUrl, title, idea, isTemplate },
    user: { _id },
  } = entry;

  let data = await dbService.createOneRecord("AdCreativeCustomTemplateModel", {
    templateSetting,
    mediaUrl,
    title,
    idea,
    isTemplate,
    userId: ObjectId(_id),
    createdAt: Date.now(),
  });

  return data;
};
