import dbService from "../../utilities/dbService";
import { discoverEmailEvent } from "../socketEvent/discoverEmailEvent";
const ObjectId = require("mongodb").ObjectID;

export const discoverEmailWebhook = async (request) => {
  let data = request?.body;

  if (data?.id) {
    let enrowEmailStatus = "completed";
    if (!data?.result?.email) {
      enrowEmailStatus = "failed";
    }

    await dbService.updateOneRecords(
      "LinkedinUserDataModel",
      { enrowEmailId: data?.id },
      {
        enrowWebhookResponse: data,
        enrowQualification: data?.result?.qualification,
        enrowEmailStatus: enrowEmailStatus,
        enrowEmail: data?.result?.email,
        enrowInfo: data?.result?.info,
      }
    );

    let connectionData = await dbService.findOneRecord(
      "LinkedinUserDataModel",
      { enrowEmailId: data?.id },
      {
        _id: 1,
        email: 1,
        enrowEmail: 1,
        enrowEmailStatus: 1,
        userId: 1,
      }
    );

    const connectionId = data?.result?.custom?.connectionId;
    let modelId = "";

    if (connectionId) {
      if (data?.result?.custom?.type == "connection") {
        let modelData = await dbService.findOneRecord(
          "LinkedinConnectionModel",
          { _id: ObjectId(connectionId) },
          {
            _id: 1,
          }
        );
        modelId = modelData?._id;
      } else if (data?.result?.custom?.type == "connected") {
        let modelData = await dbService.findOneRecord(
          "LinkedinConnectedModel",
          { _id: ObjectId(connectionId) },
          {
            _id: 1,
          }
        );
        modelId = modelData?._id;
      } else if (data?.result?.custom?.type == "follower") {
        let modelData = await dbService.findOneRecord(
          "LinkedinFollowerModel",
          { _id: ObjectId(connectionId) },
          {
            _id: 1,
          }
        );
        modelId = modelData?._id;
      } else if (data?.result?.custom?.type == "following") {
        let modelData = await dbService.findOneRecord(
          "linkedinFollowingModel",
          { _id: ObjectId(connectionId) },
          {
            _id: 1,
          }
        );
        modelId = modelData?._id;
      }
    }
    
    if (connectionData) {
      let socketData = JSON.parse(JSON.stringify(connectionData));
      socketData = { ...socketData, _id: modelId };
      discoverEmailEvent({
        userId: data?.result?.custom?.userId,
        data: socketData,
      });
    }
  }

  return "";
};
