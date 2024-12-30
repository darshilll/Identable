import { Router } from "express";
import commonResolver from "../../../utilities/commonResolver";
import userAuthentication from "../../../middleware/authentication/userAuthentication";

const router = new Router();

//=================== Schema ===================

import { getPostListSchema } from "./getPostList";
import { getDashboardDataSchema } from "./getDashboardData";

import { getAllPostListSchema } from "./getAllPostList";
import { getTopPerformingPostListSchema } from "./getTopPerformingPostList";

import { getPostReachSchema } from "./getPostReach";
import { getAudienceDataSchema } from "./getAudienceData";
import { getEngagementDataSchema } from "./getEngagementData";
import { getOverviewDataSchema } from "./getOverviewData";
import { getIndutryDataSchema } from "./getIndutryData";
import { getMapDataSchema } from "./getMapData";
import { getEngagementHourDataSchema } from "./getEngagementHourData";

import { getAgeGenderDataSchema } from "./getAgeGenderData";
import { getCampaignDataSchema } from "./getCampaignData";

import { getSocialSellingIndexDataSchema } from "./getSocialSellingIndexData";

//=================== Services ===================

import { getPostList } from "../../../services/dashboard/getPostList";
import { getDshaboardData } from "../../../services/dashboard/getDshaboardData";

import { getAllPostList } from "../../../services/dashboard/getAllPostList";
import { getTopPerformingPostList } from "../../../services/dashboard/getTopPerformingPostList";

import { getPostReach } from "../../../services/dashboard/getPostReach";
import { getAudienceData } from "../../../services/dashboard/getAudienceData";
import { getEngagementData } from "../../../services/dashboard/getEngagementData";
import { getOverviewData } from "../../../services/dashboard/getOverviewData";
import { getIndutryData } from "../../../services/dashboard/getIndutryData";
import { getMapData } from "../../../services/dashboard/getMapData";
import { getEngagementHourData } from "../../../services/dashboard/getEngagementHourData";
import { getCampaignData } from "../../../services/dashboard/getCampaignData";

import { getAgeGenderData } from "../../../services/dashboard/getAgeGenderData";
import { getSocialSellingIndexData } from "../../../services/dashboard/getSocialSellingIndexData";

//=================== Permission ===================
import { subscriptionPermission } from "../../../middleware/authorization/subscriptionPermission";
import { accountSettingsPermission } from "../../../middleware/authorization/accountSettingsPermission";

//=================== Route ===================

router.post(
  "/getPostList",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: getPostList,
    isRequestValidateRequired: true,
    schemaValidate: getPostListSchema,
  })
);

router.post(
  "/getDashboardData",
  userAuthentication.bind({}),
  subscriptionPermission,
  accountSettingsPermission,
  commonResolver.bind({
    modelService: getDshaboardData,
    isRequestValidateRequired: true,
    schemaValidate: getDashboardDataSchema,
  })
);

//New Dashboard API`s

router.post(
  "/getAllPostList",
  userAuthentication.bind({}),
  accountSettingsPermission,
  commonResolver.bind({
    modelService: getAllPostList,
    isRequestValidateRequired: true,
    schemaValidate: getAllPostListSchema,
  })
);

router.post(
  "/getTopPerformingPostList",
  userAuthentication.bind({}),
  accountSettingsPermission,
  commonResolver.bind({
    modelService: getTopPerformingPostList,
    isRequestValidateRequired: true,
    schemaValidate: getTopPerformingPostListSchema,
  })
);

router.post(
  "/getAgeGenderData",
  userAuthentication.bind({}),
  accountSettingsPermission,
  commonResolver.bind({
    modelService: getAgeGenderData,
    isRequestValidateRequired: true,
    schemaValidate: getAgeGenderDataSchema,
  })
);

router.post(
  "/getPostReach",
  userAuthentication.bind({}),
  accountSettingsPermission,
  commonResolver.bind({
    modelService: getPostReach,
    isRequestValidateRequired: true,
    schemaValidate: getPostReachSchema,
  })
);

router.post(
  "/getAudienceData",
  userAuthentication.bind({}),
  accountSettingsPermission,
  commonResolver.bind({
    modelService: getAudienceData,
    isRequestValidateRequired: true,
    schemaValidate: getAudienceDataSchema,
  })
);

router.post(
  "/getEngagementData",
  userAuthentication.bind({}),
  accountSettingsPermission,
  commonResolver.bind({
    modelService: getEngagementData,
    isRequestValidateRequired: true,
    schemaValidate: getEngagementDataSchema,
  })
);

router.post(
  "/getOverviewData",
  userAuthentication.bind({}),
  accountSettingsPermission,
  commonResolver.bind({
    modelService: getOverviewData,
    isRequestValidateRequired: true,
    schemaValidate: getOverviewDataSchema,
  })
);

router.post(
  "/getIndutryData",
  userAuthentication.bind({}),
  accountSettingsPermission,
  commonResolver.bind({
    modelService: getIndutryData,
    isRequestValidateRequired: true,
    schemaValidate: getIndutryDataSchema,
  })
);

router.post(
  "/getMapData",
  userAuthentication.bind({}),
  accountSettingsPermission,
  commonResolver.bind({
    modelService: getMapData,
    isRequestValidateRequired: true,
    schemaValidate: getMapDataSchema,
  })
);

router.post(
  "/getEngagementHourData",
  userAuthentication.bind({}),
  accountSettingsPermission,
  commonResolver.bind({
    modelService: getEngagementHourData,
    isRequestValidateRequired: true,
    schemaValidate: getEngagementHourDataSchema,
  })
);

router.post(
  "/getCampaignData",
  userAuthentication.bind({}),
  accountSettingsPermission,
  commonResolver.bind({
    modelService: getCampaignData,
    isRequestValidateRequired: true,
    schemaValidate: getCampaignDataSchema,
  })
);

router.post(
  "/getSocialSellingIndexData",
  userAuthentication.bind({}),
  accountSettingsPermission,
  commonResolver.bind({
    modelService: getSocialSellingIndexData,
    isRequestValidateRequired: true,
    schemaValidate: getSocialSellingIndexDataSchema,
  })
);

export default router;
