import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;
import { postMessage } from "../../utilities/socketServices";

export const discoverEmailEvent = async (entry) => {
  try {
    let { userId, data } = entry;

    let connectionData = await dbService.findAllRecords(
      "ConnectionModel",
      {
        userId: userId,
      },
      {
        connectionId: 1,
      }
    );
    let connectionIds = connectionData?.map((obj) => obj?.connectionId);

    if (connectionIds?.length > 0) {
      const promises = connectionIds?.map(
        async (connectionId) =>
          await postMessage({
            connectionId: connectionId,
            eventName: "discoverEmailEvent",
            eventData: data,
          })
      );
      await Promise.all(promises);
    }
  } catch (error) {
    console.error("discoverEmailEvent error = ", error);
  }
  return "Success";
};
