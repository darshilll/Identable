import { Router } from "express";
import commonResolver from "../../../utilities/commonResolver";

const router = new Router();

//=================== Schema ===================

import { saveIntegrationSchema } from "./saveIntegration";
import { savePostDataSchema } from "./savePostData";
import { postScheduleStatusSchema } from "./postScheduleStatus";
import { updateCookieStatusSchema } from "./updateCookieStatus";
import { saveProspectsDataSchema } from "./crm/saveProspectsData";
import { initiateConnectionStatusSchema } from "./crm/initiateConnectionStatus";
import { postCommentSchema } from "./crm/postComment";
import { saveLinkedinConnectionDataSchema } from "./saveLinkedinConnectionData";
import { updateJobStatusSchema } from "./updateJobStatus";
import { saveLinkedinFollowersDataSchema } from "./saveLinkedinFollowersData";
import { saveLinkedinUserDataSchema } from "./saveLinkedinUserData";
import { savePostAnalyticsDataSchema } from "./savePostAnalyticsData";
import { saveInviteFollowerDataSchema } from "./crm/saveInviteFollowerData";
import { saveSocialSellingIndexSchema } from "./saveSocialSellingIndex";

//=================== Services ===================

import { saveIntegration } from "../../../services/automation/saveIntegration";
import { savePostData } from "../../../services/automation/savePostData";
import { postScheduleStatus } from "../../../services/automation/postScheduleStatus";
import { updateCookieStatus } from "../../../services/automation/updateCookieStatus";
import { saveProspectsData } from "../../../services/automation/crm/saveProspectsData";
import { initiateConnectionStatus } from "../../../services/automation/crm/initiateConnectionStatus";
import { postComment } from "../../../services/automation/crm/postComment";
import { saveLinkedinConnectionData } from "../../../services/automation/saveLinkedinConnectionData";
import { updateJobStatus } from "../../../services/automation/updateJobStatus";
import { saveLinkedinFollowersData } from "../../../services/automation/saveLinkedinFollowersData";
import { saveLinkedinUserData } from "../../../services/automation/saveLinkedinUserData";
import { savePostAnalyticsData } from "../../../services/automation/savePostAnalyticsData";
import { saveInviteFollowerData } from "../../../services/automation/crm/saveInviteFollowerData";
import { saveSocialSellingIndex } from "../../../services/automation/saveSocialSellingIndex";

//=================== Permission ===================

//=================== Route ===================

router.post(
  "/saveIntegration",
  commonResolver.bind({
    modelService: saveIntegration,
    isRequestValidateRequired: false,
    schemaValidate: saveIntegrationSchema,
  })
);

router.post(
  "/savePost",
  commonResolver.bind({
    modelService: savePostData,
    isRequestValidateRequired: false,
    schemaValidate: savePostDataSchema,
  })
);

router.post(
  "/postScheduleStatus",
  commonResolver.bind({
    modelService: postScheduleStatus,
    isRequestValidateRequired: false,
    schemaValidate: postScheduleStatusSchema,
  })
);

router.post(
  "/updateCookieStatus",
  commonResolver.bind({
    modelService: updateCookieStatus,
    isRequestValidateRequired: false,
    schemaValidate: updateCookieStatusSchema,
  })
);

router.post(
  "/crm/saveProspects",
  commonResolver.bind({
    modelService: saveProspectsData,
    isRequestValidateRequired: false,
    schemaValidate: saveProspectsDataSchema,
  })
);

router.post(
  "/crm/initiateConnectionStatus",
  commonResolver.bind({
    modelService: initiateConnectionStatus,
    isRequestValidateRequired: false,
    schemaValidate: initiateConnectionStatusSchema,
  })
);

router.post(
  "/crm/postComment",
  commonResolver.bind({
    modelService: postComment,
    isRequestValidateRequired: false,
    schemaValidate: postCommentSchema,
  })
);

router.post(
  "/saveLinkedinConnection",
  commonResolver.bind({
    modelService: saveLinkedinConnectionData,
    isRequestValidateRequired: false,
    schemaValidate: saveLinkedinConnectionDataSchema,
  })
);

router.post(
  "/updateJobStatus",
  commonResolver.bind({
    modelService: updateJobStatus,
    isRequestValidateRequired: false,
    schemaValidate: updateJobStatusSchema,
  })
);

router.post(
  "/saveLinkedinFollowers",
  commonResolver.bind({
    modelService: saveLinkedinFollowersData,
    isRequestValidateRequired: false,
    schemaValidate: saveLinkedinFollowersDataSchema,
  })
);

router.post(
  "/saveLinkedinUserData",
  commonResolver.bind({
    modelService: saveLinkedinUserData,
    isRequestValidateRequired: false,
    schemaValidate: saveLinkedinUserDataSchema,
  })
);

router.post(
  "/savePostAnalyticsData",
  commonResolver.bind({
    modelService: savePostAnalyticsData,
    isRequestValidateRequired: false,
    schemaValidate: savePostAnalyticsDataSchema,
  })
);

router.post(
  "/crm/saveInviteFollowerData",
  commonResolver.bind({
    modelService: saveInviteFollowerData,
    isRequestValidateRequired: false,
    schemaValidate: saveInviteFollowerDataSchema,
  })
);

router.post(
  "/saveSocialSellingIndex",
  commonResolver.bind({
    modelService: saveSocialSellingIndex,
    isRequestValidateRequired: false,
    schemaValidate: saveSocialSellingIndexSchema,
  })
);

export default router;
