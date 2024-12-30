const moment = require("moment-timezone");
import dbService from "../../../utilities/dbService";
import { prospectDataEvent } from "../../socketEvent/prospectDataEvent";
import { FOLLOW_STATUS } from "../../../utilities/constants";

const ObjectId = require("mongodb").ObjectID;

export const saveInviteFollowerData = async (entry) => {
  let {
    body: {
      page_id,
      invited_prospects,
      uninvited_prospects,
      user_id,
      campaign_id,
    },
  } = entry;

  const userData = await dbService.findOneRecord("UserModel", {
    _id: ObjectId(user_id),
  });

  if (!userData) {
    throw new Error("User not found");
  }

  if (invited_prospects?.length > 0) {
    let usernameArray = invited_prospects?.map((obj) => obj?.username);

    if (usernameArray?.length > 0) {
      await dbService.updateManyRecords(
        "LinkedinFollowingModel",
        {
          linkedinUserName: { $in: usernameArray },
          pageId: ObjectId(page_id),
        },
        {
          currentStatus: FOLLOW_STATUS.SENT,
          sentAt: Date.now(),
        }
      );
    }
  }

  return "Invite Follower Data saved successfully";
};
