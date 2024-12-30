import { Router } from "express";
import commonResolver from "../../../utilities/commonResolver";
import userAuthentication from "../../../middleware/authentication/userAuthentication";

const router = new Router();

//=================== Schema ===================
import { generateOneClickSchema } from "./generateOneClick";
import { getOneClickScheduleSchema } from "./getOneClickSchedule";
import { getOneClickCampaignListSchema } from "./getOneClickCampaignList";
import { getCampaignPostsSchema } from "./getCampaignPosts";
import { getCampaignBoostCreditSchema } from "./getCampaignBoostCredit";
import { activeCampaignBoostingSchema } from "./activeCampaignBoosting";

//=================== Services ===================
import { generateOneClick } from "../../../services/oneClick/generateOneClick";
import { getOneClickSchedule } from "../../../services/oneClick/getOneClickSchedule";
import { getOneClickCampaignList } from "../../../services/oneClick/getOneClickCampaignList";
import { getCampaignPosts } from "../../../services/oneClick/getCampaignPosts";
import { getCampaignBoostCredit } from "../../../services/oneClick/getCampaignBoostCredit";
import { activeCampaignBoosting } from "../../../services/oneClick/activeCampaignBoosting";

//=================== Permission ===================
import { subscriptionPermission } from "../../../middleware/authorization/subscriptionPermission";

//=================== Route ===================

router.post(
  "/generateOneClick",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: generateOneClick,
    isRequestValidateRequired: true,
    schemaValidate: generateOneClickSchema,
  })
);

router.post(
  "/getOneClickSchedule",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: getOneClickSchedule,
    isRequestValidateRequired: true,
    schemaValidate: getOneClickScheduleSchema,
  })
);

router.post(
  "/getOneClickCampaignList",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: getOneClickCampaignList,
    isRequestValidateRequired: true,
    schemaValidate: getOneClickCampaignListSchema,
  })
);

router.post(
  "/getCampaignPosts",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: getCampaignPosts,
    isRequestValidateRequired: true,
    schemaValidate: getCampaignPostsSchema,
  })
);

router.post(
  "/getCampaignBoostCredit",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: getCampaignBoostCredit,
    isRequestValidateRequired: true,
    schemaValidate: getCampaignBoostCreditSchema,
  })
);

router.post(
  "/activeCampaignBoosting",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: activeCampaignBoosting,
    isRequestValidateRequired: true,
    schemaValidate: activeCampaignBoostingSchema,
  })
);

export default router;
