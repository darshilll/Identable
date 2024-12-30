import dbService from "../../utilities/dbService";
import { POST_GENERATE_TYPE, POST_STATUS } from "../../utilities/constants";

const ObjectId = require("mongodb").ObjectID;

export const deleteTheme = async (entry) => {
  let {
    params: { id },
    user: { _id },
  } = entry;

  let findThem = await dbService.findOneRecord("ThemeModel", {
    _id: id,
    userId: _id,
    isDeleted: false,
  });

  if (!findThem) throw new Error("Theme not found!");

  await dbService.updateOneRecords(
    "ThemeModel",
    { _id: id, userId: _id, isDeleted: false },
    {
      isDeleted: true,
      deletedAt: Date.now(),
    }
  );

  return "Theme deleted successfully";
};
