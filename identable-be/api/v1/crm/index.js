import { Router } from "express";
import commonResolver from "../../../utilities/commonResolver";
import userAuthentication from "../../../middleware/authentication/userAuthentication";

const router = new Router();

//=================== Schema ===================
import { saveCampaignSchema } from "./saveCampaign";
import { getProspectListSchema } from "./getProspectList";
import { getCampaignDataSchema } from "./getCampaignData";
import { updateCampaignStatusSchema } from "./updateCampaignStatus";
import { deleteProspectSchema } from "./deleteProspect";
import { getProcessingCampaignSchema } from "./getProcessingCampaign";
import { getCampaignListSchema } from "./getCampaignList";
import { discoverEmailSchema } from "./discoverEmail";
import { discoverEmailWebhookSchema } from "./discoverEmailWebhook";
import { getConnectedListSchema } from "./getConnectedList";
import { saveCompanyCampaignSchema } from "./saveCompanyCampaign";
import { getCompanyCampaignDataSchema } from "./getCompanyCampaignData";
import { getAgeGroupSchema } from "./getAgeGroup";
import { getIndustryGroupSchema } from "./getIndustryGroup";
import { getCityGroupSchema } from "./getCityGroup";

//=================== Services ===================
import { saveCampaign } from "../../../services/crm/saveCampaign";
import { getProspectList } from "../../../services/crm/getProspectList";
import { getCampaignData } from "../../../services/crm/getCampaignData";
import { updateCampaignStatus } from "../../../services/crm/updateCampaignStatus";
import { deleteProspect } from "../../../services/crm/deleteProspect";
import { getProcessingCampaign } from "../../../services/crm/getProcessingCampaign";
import { getCampaignList } from "../../../services/crm/getCampaignList";
import { discoverEmail } from "../../../services/crm/discoverEmail";
import { discoverEmailWebhook } from "../../../services/crm/discoverEmailWebhook";
import { getConnectedList } from "../../../services/crm/getConnectedList";
import { saveCompanyCampaign } from "../../../services/crm/saveCompanyCampaign";
import { getCompanyCampaignData } from "../../../services/crm/getCompanyCampaignData";
import { getAgeGroup } from "../../../services/crm/getAgeGroup";
import { getIndustryGroup } from "../../../services/crm/getIndustryGroup";
import { getCityGroup } from "../../../services/crm/getCityGroup";

//=================== Permission ===================
import { subscriptionPermission } from "../../../middleware/authorization/subscriptionPermission";
import { accountSettingsPermission } from "../../../middleware/authorization/accountSettingsPermission";

//=================== Route ===================

router.post(
  "/saveCampaign",
  userAuthentication.bind({}),
  subscriptionPermission,
  accountSettingsPermission,
  commonResolver.bind({
    modelService: saveCampaign,
    isRequestValidateRequired: true,
    schemaValidate: saveCampaignSchema,
  })
);

router.post(
  "/getProspectList",
  userAuthentication.bind({}),
  subscriptionPermission,
  accountSettingsPermission,
  commonResolver.bind({
    modelService: getProspectList,
    isRequestValidateRequired: true,
    schemaValidate: getProspectListSchema,
  })
);

router.post(
  "/getCampaignData",
  userAuthentication.bind({}),
  subscriptionPermission,
  accountSettingsPermission,
  commonResolver.bind({
    modelService: getCampaignData,
    isRequestValidateRequired: true,
    schemaValidate: getCampaignDataSchema,
  })
);

router.post(
  "/updateCampaignStatus",
  userAuthentication.bind({}),
  subscriptionPermission,
  accountSettingsPermission,
  commonResolver.bind({
    modelService: updateCampaignStatus,
    isRequestValidateRequired: true,
    schemaValidate: updateCampaignStatusSchema,
  })
);

router.post(
  "/deleteProspect",
  userAuthentication.bind({}),
  subscriptionPermission,
  accountSettingsPermission,
  commonResolver.bind({
    modelService: deleteProspect,
    isRequestValidateRequired: true,
    schemaValidate: deleteProspectSchema,
  })
);

router.post(
  "/getProcessingCampaign",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: getProcessingCampaign,
    isRequestValidateRequired: true,
    schemaValidate: getProcessingCampaignSchema,
  })
);

router.post(
  "/getCampaignList",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: getCampaignList,
    isRequestValidateRequired: true,
    schemaValidate: getCampaignListSchema,
  })
);

router.post(
  "/discoverEmail",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: discoverEmail,
    isRequestValidateRequired: true,
    schemaValidate: discoverEmailSchema,
  })
);

router.post(
  "/discoverEmailWebhook",
  commonResolver.bind({
    modelService: discoverEmailWebhook,
    isRequestValidateRequired: false,
    schemaValidate: discoverEmailWebhookSchema,
  })
);

router.post(
  "/getConnectedList",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: getConnectedList,
    isRequestValidateRequired: false,
    schemaValidate: getConnectedListSchema,
  })
);

router.post(
  "/saveCompanyCampaign",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: saveCompanyCampaign,
    isRequestValidateRequired: false,
    schemaValidate: saveCompanyCampaignSchema,
  })
);

router.post(
  "/getCompanyCampaignData",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: getCompanyCampaignData,
    isRequestValidateRequired: false,
    schemaValidate: getCompanyCampaignDataSchema,
  })
);

router.post(
  "/getAgeGroup",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: getAgeGroup,
    isRequestValidateRequired: false,
    schemaValidate: getAgeGroupSchema,
  })
);

router.post(
  "/getIndustryGroup",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: getIndustryGroup,
    isRequestValidateRequired: false,
    schemaValidate: getIndustryGroupSchema,
  })
);


router.post(
  "/getCityGroup",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: getCityGroup,
    isRequestValidateRequired: false,
    schemaValidate: getCityGroupSchema,
  })
);


export default router;
