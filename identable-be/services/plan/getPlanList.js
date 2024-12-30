import dbService from "../../utilities/dbService";
import { SUBSCRIPTION_STATUS, PLAN } from "../../utilities/constants";
const ObjectId = require("mongodb").ObjectID;

export const getPlanList = async (entry) => {
  let {
    user: { _id },
  } = entry;

  let planData = await dbService.findAllRecords("PlanModel", {
    isDeleted: false,
  });

  // const subscriptionData = await dbService.findOneRecord(
  //   "SubscriptionModel",
  //   {
  //     _id: ObjectId(_id),
  //   },
  //   { subscriptionStatus: 1, planId: 1 }
  // );

  // let planArray = [];
  // for (let i = 0; i < planData?.length; i++) {

  //   let plan = JSON.parse(JSON.stringify(planData[i]));
  //   let isDisable = false;
  //   let isCurrentPlan = false;

  //   if (subscriptionData?.subscriptionStatus != SUBSCRIPTION_STATUS.TRIAL) {
  //     if (plan?._id?.toString() == PLAN.TRY_IT_ON) {
  //       if (subscriptionData?.planId == PLAN.TRY_IT_ON) {
  //         isDisable = true;
  //         isCurrentPlan = true;
  //       } else if (subscriptionData?.planId == PLAN.YOUR_GROWING) {
  //         isDisable = false;
  //       } else if (subscriptionData?.planId == PLAN.MASTER) {
  //         isDisable = false;
  //       }
  //     } else if (plan?._id?.toString() == PLAN.YOUR_GROWING) {
  //       if (subscriptionData?.planId == PLAN.TRY_IT_ON) {
  //         isDisable = true;
  //       } else if (subscriptionData?.planId == PLAN.YOUR_GROWING) {
  //         isDisable = true;
  //         isCurrentPlan = true;
  //       } else if (subscriptionData?.planId == PLAN.MASTER) {
  //         isDisable = false;
  //       }
  //     } else if (plan?._id?.toString() == PLAN.MASTER) {
  //       if (subscriptionData?.planId == PLAN.TRY_IT_ON) {
  //         isDisable = true;
  //       } else if (subscriptionData?.planId == PLAN.YOUR_GROWING) {
  //         isDisable = true;
  //       } else if (subscriptionData?.planId == PLAN.MASTER) {
  //         isDisable = true;
  //         isCurrentPlan = true;
  //       }
  //     }
  //   }
  //   plan = {
  //     ...plan,
  //     isDisable,
  //     isCurrentPlan,
  //   };
  //   planArray.push(plan);
  // }

  return planData;
};
