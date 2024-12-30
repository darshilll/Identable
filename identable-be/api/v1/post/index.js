import { Router } from "express";
import commonResolver from "../../../utilities/commonResolver";
import userAuthentication from "../../../middleware/authentication/userAuthentication";

const router = new Router();

//=================== Schema ===================
import { savePostSchema } from "./savePost";
import { getPostSchema } from "./getPost";
import { getPostByIdSchema } from "./getPostById";
import { activeBoostingSchema } from "./activeBoosting";
import { reschedulePostSchema } from "./reschedulePost";
import { deletePostSchema } from "./deletePost";

//=================== Services ===================
import { savePost } from "../../../services/post/savePost";
import { activeBoosting } from "../../../services/post/activeBoosting";
import { getPost } from "../../../services/post/getPost";
import { getPostById } from "../../../services/post/getPostById";
import { reschedulePost } from "../../../services/post/reschedulePost";
import { deletePost } from "../../../services/post/deletePost";

//=================== Permission ===================
import { subscriptionPermission } from "../../../middleware/authorization/subscriptionPermission";
import { accountSettingsPermission } from "../../../middleware/authorization/accountSettingsPermission";

//=================== Route ===================

router.post(
  "/savePost",
  userAuthentication.bind({}),
  subscriptionPermission,
  accountSettingsPermission,
  commonResolver.bind({
    modelService: savePost,
    isRequestValidateRequired: true,
    schemaValidate: savePostSchema,
  })
);

router.post(
  "/reschedulePost",
  userAuthentication.bind({}),
  subscriptionPermission,
  accountSettingsPermission,
  commonResolver.bind({
    modelService: reschedulePost,
    isRequestValidateRequired: true,
    schemaValidate: reschedulePostSchema,
  })
);

router.post(
  "/activeBoosting",
  userAuthentication.bind({}),
  subscriptionPermission,
  accountSettingsPermission,
  commonResolver.bind({
    modelService: activeBoosting,
    isRequestValidateRequired: true,
    schemaValidate: activeBoostingSchema,
  })
);

router.post(
  "/getPost",
  userAuthentication.bind({}),
  subscriptionPermission,
  accountSettingsPermission,
  commonResolver.bind({
    modelService: getPost,
    isRequestValidateRequired: true,
    schemaValidate: getPostSchema,
  })
);

router.post(
  "/getPostById",
  userAuthentication.bind({}),
  subscriptionPermission,
  accountSettingsPermission,
  commonResolver.bind({
    modelService: getPostById,
    isRequestValidateRequired: true,
    schemaValidate: getPostByIdSchema,
  })
);

router.post(
  "/deletePost",
  userAuthentication.bind({}),
  subscriptionPermission,
  accountSettingsPermission,
  commonResolver.bind({
    modelService: deletePost,
    isRequestValidateRequired: true,
    schemaValidate: deletePostSchema,
  })
);


export default router;
