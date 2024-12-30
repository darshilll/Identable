import { Router } from "express";
import commonResolver from "../../../utilities/commonResolver";
import userAuthentication from "../../../middleware/authentication/userAuthentication";

const router = new Router();

//=================== Schema ===================

import { getJobRequestListSchema } from "./getJobRequestList";
import { getUserListSchema } from "./getUserList";
import { retryJobRequestSchema } from "./retryJobRequest";

//=================== Services ===================

import { getJobRequestList } from "../../../services/admin/getJobRequestList";
import { getUserList } from "../../../services/admin/getUserList";
import { retryJobRequest } from "../../../services/admin/retryJobRequest";

//=================== Permission ===================
import { adminPermission } from "../../../middleware/authorization/adminPermission";
import { automationPermission } from "../../../middleware/authorization/automationPermission";

//=================== Route ===================
router.post(
  "/getJobRequestList",
  userAuthentication.bind({}),
  automationPermission,
  commonResolver.bind({
    modelService: getJobRequestList,
    isRequestValidateRequired: true,
    schemaValidate: getJobRequestListSchema,
  })
);

router.post(
  "/getUserList",
  userAuthentication.bind({}),
  adminPermission,
  commonResolver.bind({
    modelService: getUserList,
    isRequestValidateRequired: true,
    schemaValidate: getUserListSchema,
  })
);

router.post(
  "/retryJobRequest",
  userAuthentication.bind({}),
  automationPermission,
  commonResolver.bind({
    modelService: retryJobRequest,
    isRequestValidateRequired: true,
    schemaValidate: retryJobRequestSchema,
  })
);

export default router;
