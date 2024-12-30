import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;

export const getAdCreativeTemplates = async (entry) => {
  let {
    body: {},
    user: { _id, chatGPTVersion },
  } = entry;

  let data = await dbService.findAllRecords(
    "AdCreativeModel",
    {
      isDeleted: false,
    },
    {
      templateSetting: 1,
    }
  );

  let templateArray = [];
  for (let i = 0; i < data?.length; i++) {
    let element = data[i];

    let newData = {
      ...element?.templateSetting,
      templateId: element?._id,
    };
    templateArray.push(newData);
  }

  return templateArray;
};
