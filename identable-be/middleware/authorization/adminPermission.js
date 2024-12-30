import dbService from "../../utilities/dbService";
import { failAction } from "../../utilities/response";

const ObjectId = require("mongodb").ObjectID;

export const adminPermission = async (req, res, next) => {
  try {
    const userData = await dbService.findOneRecord(
      "UserModel",
      { _id: ObjectId(req.user._id) },
      {
        userRole: 1,
      }
    );

    if (userData?.userRole == "admin") {
      next();
      return;
    }
    return res
      .status(406)
      .json(failAction("You are not allowed to access this page"));
  } catch (error) {
    console.error("adminPermission error = ", error);
    return res
      .status(406)
      .json(failAction("You are not allowed to access this page"));
  }
};
