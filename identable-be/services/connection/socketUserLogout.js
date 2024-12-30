import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;

export const socketUserLogout = async (entry) => {
  try {
    let { userId, connectionId } = entry;

    if (userId && connectionId) {
      await dbService.deleteManyRecords("ConnectionModel", {
        userId: userId,
      });

      await dbService.updateOneRecords(
        "UserModel",
        {
          _id: userId,
        },
        {
          lastActiveDate: Date.now(),
          loginToken: "",
        }
      );
    }
  } catch (error) {
    console.error("socketConnected error = ", error);
  }
  return true;
};
