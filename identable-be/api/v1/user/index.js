import { Router } from "express";
import commonResolver from "../../../utilities/commonResolver";
import userAuthentication from "../../../middleware/authentication/userAuthentication";

const router = new Router();

//=================== Schema ===================
import { updateProfileSchema } from "./updateProfile";
import { saveLinkedinCookiesSchema } from "./saveLinkedinCookies";
import { getLinkedinPageListSchema } from "./getLinkedinPageList";
import { getUserDetailsSchema } from "./getUserDetails";
import { saveAISettingSchema } from "./saveAISetting";
import { getAISettingSchema } from "./getAISetting";
import { updateAccountSettingFlagSchema } from "./updateAccountSettingFlag";
import { changeProfileSchema } from "./changeProfile";
import { runJobManualSchema } from "./runJobManual";
import { savePageAccessSchema } from "./savePageAccess";
import { updateProfileSettingSchema } from "./updateProfileSettings";
import { updateLinkedinPageDataSchema } from "./updateLinkedinPageDataSchema ";

//=================== Services ===================
import { updateProfile } from "../../../services/user/updateProfile";
import { saveLinkedinCookies } from "../../../services/user/saveLinkedinCookies";
import { getLinkedinPageList } from "../../../services/user/getLinkedinPageList";
import { getUserDetails } from "../../../services/user/getUserDetails";
import { saveAISetting } from "../../../services/user/saveAISetting";
import { getAISetting } from "../../../services/user/getAISetting";
import { updateAccountSettingFlag } from "../../../services/user/updateAccountSettingFlag";
import { changeProfile } from "../../../services/user/changeProfile";
import { runJobManual } from "../../../services/user/runJobManual";
import { savePageAccess } from "../../../services/user/savePageAccess";
import { updateProfileSettings } from "../../../services/user/updateProfileSettings";
import { updateLinkedinPageData, uploadS3Files } from "../../../services/user/updateLinkedinPageData";

//=================== Permission ===================
import { subscriptionPermission } from "../../../middleware/authorization/subscriptionPermission";
import { getDefaultAISettings } from "./DefaultAiSetting";
import { DefaultAISetting } from "../../../services/user/DefaultAiSetting";

//=================== Route ===================

router.post(
  "/updateProfile",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: updateProfile,
    isRequestValidateRequired: true,
    schemaValidate: updateProfileSchema,
  })
);

router.post(
  "/saveLinkedinCookies",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: saveLinkedinCookies,
    isRequestValidateRequired: true,
    schemaValidate: saveLinkedinCookiesSchema,
  })
);

router.get(
  "/getLinkedinPageList",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: getLinkedinPageList,
    isRequestValidateRequired: true,
    schemaValidate: getLinkedinPageListSchema,
  })
);

router.get(
  "/getUserDetails",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: getUserDetails,
    isRequestValidateRequired: true,
    schemaValidate: getUserDetailsSchema,
  })
);

router.post(
  "/saveAISetting",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: saveAISetting,
    isRequestValidateRequired: true,
    schemaValidate: saveAISettingSchema,
  })
);

router.get(
  "/getAISetting",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: getAISetting,
    isRequestValidateRequired: true,
    schemaValidate: getAISettingSchema,
  })
);

router.post(
  "/updateAccountSettingFlag",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: updateAccountSettingFlag,
    isRequestValidateRequired: true,
    schemaValidate: updateAccountSettingFlagSchema,
  })
);

router.post(
  "/changeProfile",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: changeProfile,
    isRequestValidateRequired: true,
    schemaValidate: changeProfileSchema,
  })
);

router.post(
  "/runJobManual",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: runJobManual,
    isRequestValidateRequired: false,
    schemaValidate: runJobManualSchema,
  })
);

router.post(
  "/savePageAccess",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: savePageAccess,
    isRequestValidateRequired: true,
    schemaValidate: savePageAccessSchema,
  })
);

router.post(
  "/updateProfileSettings",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: updateProfileSettings,
    isRequestValidateRequired: true,
    schemaValidate: updateProfileSettingSchema,
  })
);

router.post(
  "/updateLinkedinPageData",
  uploadS3Files,
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: updateLinkedinPageData,
    isRequestValidateRequired: true,
    schemaValidate: updateLinkedinPageDataSchema,
  })
);

router.get(
  "/getDefaultAISetting",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: DefaultAISetting,
    isRequestValidateRequired: false,
    schemaValidate: getDefaultAISettings,
  })
);



export default router;
