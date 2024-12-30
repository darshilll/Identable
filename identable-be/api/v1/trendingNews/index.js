import { Router } from "express";
import commonResolver from "../../../utilities/commonResolver";
import userAuthentication from "../../../middleware/authentication/userAuthentication";

const router = new Router();

//=================== Schema ===================
import { getTrendingNewsSchema } from "./getTrendingNews";
import { generateNewsSummarySchema } from "./generateNewsSummary";
import { searchNewsSchema } from "./searchNews";

//=================== Services ===================
import { getTrendingNews } from "../../../services/trendingNews/getTrendingNews";
import { generateNewsSummary } from "../../../services/trendingNews/generateNewsSummary";
import { searchNews } from "../../../services/trendingNews/searchNews";

//=================== Permission ===================
import { subscriptionPermission } from "../../../middleware/authorization/subscriptionPermission";
import { accountSettingsPermission } from "../../../middleware/authorization/accountSettingsPermission";

//=================== Route ===================

router.post(
  "/getTrendingNews",
  userAuthentication.bind({}),
  subscriptionPermission,
  accountSettingsPermission,
  commonResolver.bind({
    modelService: getTrendingNews,
    isRequestValidateRequired: true,
    schemaValidate: getTrendingNewsSchema,
  })
);

router.post(
  "/generateNewsSummary",
  userAuthentication.bind({}),
  subscriptionPermission,
  accountSettingsPermission,
  commonResolver.bind({
    modelService: generateNewsSummary,
    isRequestValidateRequired: true,
    schemaValidate: generateNewsSummarySchema,
  })
);

router.post(
  "/searchNews",
  userAuthentication.bind({}),
  subscriptionPermission,
  accountSettingsPermission,
  commonResolver.bind({
    modelService: searchNews,
    isRequestValidateRequired: true,
    schemaValidate: searchNewsSchema,
  })
);

export default router;
