import dbService from "../../../utilities/dbService";
import { CONNECTION_STATUS } from "../../../utilities/constants";
const ObjectId = require("mongodb").ObjectID;

export const initiateConnectionStatus = async (entry) => {

  let dataObj = {
    updatedAt: Date.now(),
  };

  if (entry?.body?.action_type?.toLowerCase() == "visit_profile") {
    dataObj = {
      ...dataObj,
      isProfileVisited: true,
      profileVisitedAt: Date.now(),
      profileVisitedStatus: entry?.body?.status,
      currentStatus: CONNECTION_STATUS.PROFILE_VISITED,
    };

    if (entry?.body?.error) {
      dataObj = {
        ...dataObj,
        profileVisitedError: entry?.body?.error,
      };
    }
  } else if (
    entry?.body?.action_type?.toLowerCase() == "interact_with_recent_post"
  ) {
    dataObj = {
      ...dataObj,
      isCommented: true,
      commentedAt: Date.now(),
      commentedStatus: entry?.body?.status,
      currentStatus: CONNECTION_STATUS.COMMENTED,
    };

    if (entry?.body?.error) {
      dataObj = {
        ...dataObj,
        commentedError: entry?.body?.error,
      };
    }
  } else if (entry?.body?.action_type?.toLowerCase() == "follow_user") {
    dataObj = {
      ...dataObj,
      isFollowed: true,
      followedAt: Date.now(),
      followedStatus: entry?.body?.status,
      currentStatus: CONNECTION_STATUS.FOLLOWED,
    };

    if (entry?.body?.error) {
      dataObj = {
        ...dataObj,
        followedError: entry?.body?.error,
      };
    }
  } else if (
    entry?.body?.action_type?.toLowerCase() == "send_connection_request"
  ) {
    dataObj = {
      ...dataObj,
      isConnected: true,
      connectedAt: Date.now(),
      connectedStatus: entry?.body?.status,
      currentStatus: CONNECTION_STATUS.CONNECTED,
    };

    if (entry?.body?.error) {
      dataObj = {
        ...dataObj,
        connectedError: entry?.body?.error,
      };
    }
  }

  await dbService.updateOneRecords(
    "LinkedinConnectionModel",
    {
      _id: ObjectId(entry?.body?.prospect_id),
    },
    dataObj
  );

  return "Success";
};
