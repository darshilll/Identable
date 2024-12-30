import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;
import { postMessage } from "../../utilities/socketServices";

export const prospectDataEvent = async (entry) => {
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
          eventName: "prospectDataEvent",
          eventData: data,
        })
    );
    await Promise.all(promises);
  }

  return "Success";
};
