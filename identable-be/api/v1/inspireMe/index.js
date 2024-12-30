import { Router } from "express";
import commonResolver from "../../../utilities/commonResolver";
import userAuthentication from "../../../middleware/authentication/userAuthentication";

const router = new Router();

//=================== Schema ===================
import { getInspireMeSchema } from "./getInspireMe";

//=================== Services ===================
import { getInspireMe } from "../../../services/inspireMe/getInspireMe";

//=================== Permission ===================
import { subscriptionPermission } from "../../../middleware/authorization/subscriptionPermission";
import { accountSettingsPermission } from "../../../middleware/authorization/accountSettingsPermission";

//=================== Route ===================

router.post(
  "/getInspireMe",
  userAuthentication.bind({}),
  subscriptionPermission,
  accountSettingsPermission,
  commonResolver.bind({
    modelService: getInspireMe,
    isRequestValidateRequired: true,
    schemaValidate: getInspireMeSchema,
  })
);

export default router;
