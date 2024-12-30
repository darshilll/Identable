const moment = require("moment-timezone");
import dbService from "../../utilities/dbService";
import { SUBSCRIPTION_STATUS, CANCEL_REASON } from "../../utilities/constants";
import {
  faceAnalyzeService,
  imageUrlToBase64,
} from "../../utilities/faceAnalyzeService";

const ObjectId = require("mongodb").ObjectID;

export const faceAnalyze = async () => {
  const subscriptionData = await dbService.findAllRecords(
    "SubscriptionModel",
    {
      subscriptionStatus: {
        $in: [SUBSCRIPTION_STATUS.ACTIVE, SUBSCRIPTION_STATUS.TRIAL],
      },
      userId: ObjectId("668ca70ee530040031986342"),
    },
    {
      userId: 1,
    }
  );

  const userIds = subscriptionData?.map((obj) => obj?.userId);

  const linkedinConnectedData = await dbService.findAllRecords(
    "LinkedinConnectedModel",
    {
      userId: {
        $in: userIds,
      },
      isDeleted: false,
    },
    {
      linkedinUserName: 1,
    }
  );

  let linkedinConnectedUserNameArray = linkedinConnectedData?.map(
    (obj) => obj?.linkedinUserName
  );

  const linkedinFollowersData = await dbService.findAllRecords(
    "LinkedinFollowerModel",
    {
      userId: {
        $in: userIds,
      },
    },
    {
      linkedinUserName: 1,
    }
  );

  let linkedinFollowersUserNameArray = linkedinFollowersData?.map(
    (obj) => obj?.linkedinUserName
  );

  let linkedinUserNameArray = [
    ...linkedinConnectedUserNameArray,
    ...linkedinFollowersUserNameArray,
  ];

  const linkedinUserData = await dbService.findAllRecords(
    "LinkedinUserDataModel",
    {
      isScrappedAge: { $ne: true },
      imageSrc: { $nin: [null, ""] },
      username: {
        $in: linkedinUserNameArray,
      },
    },
    {
      _id: 1,
      imageSrc: 1,
    }
  );

  for (let i = 0; i < linkedinUserData?.length; i++) {

    const dataDic = linkedinUserData[i];

    let age = 0;
    let gender = "Other";
    if (dataDic?.imageSrc) {
      let base64 = await imageUrlToBase64(dataDic?.imageSrc);
      let base64Str = "data:image/jpeg;base64," + base64;
      if (base64Str) {
        let response = await faceAnalyzeService({ base64: base64Str });
        if (response?.results?.length > 0) {
          let resultDic = response?.results[0];
          if (resultDic?.age) {
            age = resultDic?.age;
            gender = resultDic?.dominant_gender;
          }
        }
      }
    }

    await dbService.updateOneRecords(
      "LinkedinUserDataModel",
      { _id: dataDic?._id },
      {
        age: age,
        gender: gender,
        isScrappedAge: true,
      }
    );
  }
};
