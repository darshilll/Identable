import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;

export const getvisualCreativesTemplate = async (entry) => {
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

  let where2;
  if (searchText) {
    const regex = new RegExp(searchText, "i");

    where = {
      ...where,
      carouselName: { $regex: regex },
    };
    where2 = {
      ...where,
      title: { $regex: regex },
    };
  }

  let adCreativedata = await dbService.findAllRecords(
    "AdCreativeCustomTemplateModel",
    where2,
    {},
    sortBy
  );

  let carouselData = await dbService.findAllRecords(
    "carouselCustomTemplateModel",
    where,
    {},
    sortBy
  );

  const mergedData = [...adCreativedata, ...carouselData];

  // Sort by date
  // const result = mergedData.sort((a, b) => new Date(a.date) - new Date(b.date));

  return mergedData;
};
