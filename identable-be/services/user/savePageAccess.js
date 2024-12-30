import dbService from "../../utilities/dbService";
import { generatePost } from "../post/generatePost";

const ObjectId = require("mongodb").ObjectID;

export const savePageAccess = async (entry) => {
  let {
    body: { pageArray },
    user: { _id },
  } = entry;

  const subscriptionData = await dbService.findOneRecord(
    "SubscriptionModel",
    {
      userId: _id,
    },
    {
      _id: 1,
      companyProfileLimit: 1,
    }
  );

  if (subscriptionData?.companyProfileLimit <= 0) {
    throw new Error(
      "You do not have access to integrate company profile. Please upgrade your plan"
    );
  }

  const filterArray = pageArray?.filter((x) => x.isAccess);
  if (filterArray.length > subscriptionData?.companyProfileLimit) {
    throw new Error(
      `You can only ${subscriptionData?.companyProfileLimit} company profile integrate.`
    );
  }

  for (let i = 0; i < pageArray?.length; i++) {
    const obj = pageArray[i];

    const pageData = await dbService.findOneRecord(
      "LinkedinPageModel",
      {
        _jd: obj?._id,
      },
      {
        _id: 1,
        isAccess: 1,
      }
    );

    if (!pageData?.isAccess) {
      await dbService.updateOneRecords(
        "LinkedinPageModel",
        {
          _id: obj?._id,
        },
        {
          isAccess: obj?.isAccess,
        }
      );
    }
  }

  return "Access updated successfully";
};
