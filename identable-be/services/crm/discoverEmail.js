import dbService from "../../utilities/dbService";
import { enrowFindSingleEmail } from "../../utilities/enrowService";
const ObjectId = require("mongodb").ObjectID;
import { checkCredit } from "../creditUsage/checkCredit";
import { updateCreditUsage } from "../creditUsage/updateCreditUsage";
import { CREDIT_TYPE } from "../../utilities/constants";

export const discoverEmail = async (entry) => {
  let {
    body: { connectionId },
    user: { _id, currentPageId },
  } = entry;

  let fullName = "";
  let companyName = "";
  let linkedinUserName = "";
  let connectionType = "connection";

  const connectionData = await dbService.findOneRecord(
    "LinkedinConnectionModel",
    { _id: ObjectId(connectionId) },
    {
      linkedinUserName: 1,
    }
  );

  if (connectionData) {
    linkedinUserName = connectionData?.linkedinUserName;
  } else {
    connectionType = "connected";
    const connectedData = await dbService.findOneRecord(
      "LinkedinConnectedModel",
      { _id: ObjectId(connectionId) },
      {
        linkedinUserName: 1,
      }
    );
    if (connectedData) {
      linkedinUserName = connectedData?.linkedinUserName;
    } else {
      connectionType = "follower";
      const followerData = await dbService.findOneRecord(
        "LinkedinFollowerModel",
        { _id: ObjectId(connectionId) },
        {
          linkedinUserName: 1,
        }
      );
      if (followerData) {
        linkedinUserName = followerData?.linkedinUserName;
      } else {
        connectionType = "following";
        const followingData = await dbService.findOneRecord(
          "linkedinFollowingModel",
          { _id: ObjectId(connectionId) },
          {
            linkedinUserName: 1,
          }
        );
        if (followingData) {
          linkedinUserName = followingData?.linkedinUserName;
        }
      }
    }
  }

  if (!linkedinUserName) {
    throw new Error("Something went wrong. Please contact support.");
  }

  const linkedinUserData = await dbService.findOneRecord(
    "LinkedinUserDataModel",
    { username: linkedinUserName },
    {
      email: 1,
      enrowEmailStatus: 1,
      companyName: 1,
      name: 1,
      headline: 1,
      primarySubTitle: 1,
      occupation: 1,
    }
  );

  if (linkedinUserData?.enrowEmail) {
    const creditUsageData = await dbService.findOneRecord(
      "LinkedinUserDataModel",
      { userId: _id, discoverEmailLinkedinUserName: linkedinUserName },
      {
        _id: 1,
      }
    );

    if (!creditUsageData) {
      await updateCreditUsage({
        userId: _id,
        pageId: currentPageId,
        creditType: CREDIT_TYPE.DISCOVER_EMAIL,
        discoverEmailLinkedinUserName: linkedinUserName,
      });
    }

    return linkedinUserData?.enrowEmail;
  }

  if (linkedinUserData?.enrowEmailStatus == "processing") {
    throw new Error(
      "Your request is being processed. Please check again after some time!"
    );
  }

  fullName = linkedinUserData?.name;
  companyName = linkedinUserData?.companyName;
  if (!companyName) {
    throw new Error("Company name not found.");
  }
  // if (!companyName) {
  //   companyName = linkedinUserData?.headline;
  // }
  // if (!companyName) {
  //   companyName = linkedinUserData?.primarySubTitle;
  // }
  // if (!companyName) {
  //   companyName = linkedinUserData?.occupation;
  // }

  await checkCredit({
    userId: _id,
    pageId: currentPageId,
    creditType: CREDIT_TYPE.DISCOVER_EMAIL,
  });

  let data = {
    fullname: fullName,
    company_name: companyName,
    custom: {
      userId: _id?.toString(),
      connectionId: connectionId?.toString(),
      type: connectionType,
    },
  };

  let enrowEmailFindResponse = await enrowFindSingleEmail(data);

  if (!enrowEmailFindResponse?.id) {
    let errorMessage = enrowEmailFindResponse?.message
      ? enrowEmailFindResponse?.message
      : "Something went wrong please try again!";
    throw new Error(errorMessage);
  }

  await dbService.updateOneRecords(
    "LinkedinUserDataModel",
    { username: linkedinUserName },
    {
      enrowEmailId: enrowEmailFindResponse?.id,
      enrowEmailStatus: "processing",
    }
  );

  // ================ Update Credit ================

  await updateCreditUsage({
    userId: _id,
    pageId: currentPageId,
    creditType: CREDIT_TYPE.DISCOVER_EMAIL,
    discoverEmailLinkedinUserName: linkedinUserName,
  });

  return {
    message: "Your request is being processed. Please check again later.",
  };
};
