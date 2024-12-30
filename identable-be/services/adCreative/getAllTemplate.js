import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;

export const getAllTemplate = async (entry) => {
  let {
    body: { searchText, sortMode, isTemplate },
    user: { _id },
  } = entry;

  let sortBy = { createdAt: -1 };
  if (sortMode) {
    sortBy = {
      createdAt: 1,
    };
  }

  let where = {
    userId: _id,
    isDeleted: false,
    isTemplate: false,
  };

  if (isTemplate) {
    where = {
      ...where,
      isTemplate: true,
    };
  }

  if (searchText) {
    const regex = new RegExp(searchText, "i");

    where = {
      ...where,
      title: { $regex: regex },
    };
  }

  let data = await dbService.findAllRecords(
    "AdCreativeCustomTemplateModel",
    where,
    {},
    sortBy
  );

  return data;
};
