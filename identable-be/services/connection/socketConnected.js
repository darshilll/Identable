import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;

export const socketConnected = async (entry) => {
  try {
    let { userId, connectionId } = entry;

    if (userId && connectionId) {
      const userData = await dbService.findOneRecord(
        "UserModel",
        {
          _id: userId,
        },
        {
          _id: 1,
        }
      );

      if (!userData) {
        return;
      }

      await dbService.updateOneRecords(
        "ConnectionModel",
        {
          userId: ObjectId(userId),
          connectionId: connectionId,
        },
        {
          $set: {
            userId: ObjectId(userId),
            connectionId: connectionId,
          },
        },
        { upsert: true }
      );
    }
  } catch (error) {
    console.error("socketConnected error = ", error);
  }
  return true;
};
