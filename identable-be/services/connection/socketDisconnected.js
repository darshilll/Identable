import dbService from "../../utilities/dbService";

export const socketDisconnected = async (entry) => {
  try {
    let { connectionId } = entry;

    if (connectionId) {
      await dbService.deleteOneRecords("ConnectionModel", {
        connectionId: connectionId,
      });
    }
  } catch (error) {
    console.error("socketDisconnected error = ", error);
  }
  return true;
};
