import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;

export const updateCookieStatus = async (entry) => {
  let {
    body: { status, userId },
  } = entry;

  if (!userId) {
    throw new Error("User not found");
  }
  const userData = await dbService.findOneRecord(
    "UserModel",
    {
      _id: ObjectId(userId),
    },
    {
      _id: 1,
    }
  );
  if (status == "INVALID_COOKIES" || status == "LoginFailedException") {
    if (userData) {
      if (userData?._id?.toString() != "65f29246bce8ed00300429df") {
        await dbService.updateOneRecords(
          "UserModel",
          {
            _id: userData?._id,
          },
          {
            isCookieValid: false,
          }
        );
      }

      await dbService.updateOneRecords(
        "BotModel",
        {
          userId: userData?._id,
        },
        {
          isCookieValid: false,
        }
      );

      return "Status updated successfully";
    }
  }

  throw new Error("User not found");
};
