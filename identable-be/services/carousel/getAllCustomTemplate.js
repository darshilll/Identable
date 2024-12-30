import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;

export const getAllCustomTemplate = async (entry) => {
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
      carouselName: { $regex: regex },
    };
  }

  let carouselData = await dbService.findAllRecords(
    "carouselCustomTemplateModel",
    where,
    {},
    sortBy
  );

  return carouselData;
};
