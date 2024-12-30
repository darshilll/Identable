import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;

export const getTemplate = async (entry) => {
  let {
    body: { templateId },
    user: { _id },
  } = entry;

  let data = await dbService.findOneRecord("AdCreativeCustomTemplateModel", {
    userId: _id,
    _id: ObjectId(templateId),
    isDeleted: false,
  });

  return data;
};
