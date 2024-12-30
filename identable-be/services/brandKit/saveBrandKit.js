import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;

export const saveBrandKit = async (entry) => {
  let {
    body: {
      imageUrl,
      logoUrl,
      primaryColor,
      secondaryColor,
      titleFont,
      bodyFont,
      accent1Color,
      accent2Color,
      website,
      contact,
    },
    user: { _id, currentPageId },
  } = entry;

  const oldBrandKit = await dbService.findOneRecord(
    "BrandkitModel",
    { pageId: ObjectId(currentPageId) },
    {
      _id: 1,
    }
  );

  let obj = {
    pageId: currentPageId,
    userId: _id,
    imageUrl,
    logoUrl,
    primaryColor,
    secondaryColor,
    titleFont,
    bodyFont,
    accent1Color,
    accent2Color,
    website,
    contact,
  };

  if (oldBrandKit) {
    obj = {
      ...obj,
      updatedAt: Date.now(),
    };
    let brandKitData = await dbService.findOneAndUpdateRecord(
      "BrandkitModel",
      { _id: oldBrandKit?._id },
      {
        $set: obj,
      },
      { new: true }
    );
    return "Brandkit saved!";
  } else {
    obj = {
      ...obj,
      createdAt: Date.now(),
    };
    let brandKitData = await dbService.createOneRecord("BrandkitModel", obj);
    return "Brandkit save successfully!";
  }
};
