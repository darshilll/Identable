import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;

export const addTheme = async (entry) => {
  let {
    body: { backgroundColor, fontColor, signatureAlign, backgroundMedia },
    user: { _id },
  } = entry;

  await dbService.createOneRecord("ThemeModel", {
    backgroundColor,
    fontColor,
    signatureAlign,
    backgroundMedia,
    userId: ObjectId(_id),
    createdAt: Date.now(),
  });

  return "Theme saved successfully";
};
