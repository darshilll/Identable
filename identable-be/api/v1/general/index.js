import { Router } from "express";
import commonResolver from "../../../utilities/commonResolver";
import userAuthentication from "../../../middleware/authentication/userAuthentication";

const router = new Router();

//=================== Schema ===================
import { commonPromptSchema } from "./commonPrompt";
import { editPostPromptSchema } from "./editPostPrompt";
import { rewritePostPromptSchema } from "./rewritePostPrompt";
import { generateDIYPostPromptSchema } from "./generateDIYPostPrompt";
import { contentMarkedSchema } from "./contentMarked";
import { contentAnalyzeSchema } from "./contentAnalyze";
import { contentHumanizeSchema } from "./contentHumanize";
import { getLinkPreviewSchema } from "./getLinkPreview";
import { getMediaListSchema } from "./getMediaList";

//=================== Services ===================
import { commonPrompt } from "../../../services/general/commonPrompt";
import { editPostPrompt } from "../../../services/general/editPostPrompt";
import { uploadS3File } from "../../../services/general/uploadFile";
import { uploadS3Fn } from "../../../utilities/upload";
import { rewritePostPrompt } from "../../../services/general/rewritePostPrompt";
import { generateDIYPostPrompt } from "../../../services/general/generateDIYPostPrompt";
import { contentMarked } from "../../../services/general/contentMarked";
import { contentAnalyze } from "../../../services/general/contentAnalyze";
import { contentHumanize } from "../../../services/general/contentHumanize";
import { getLinkPreview } from "../../../services/general/getLinkPreview";
import { getMediaList } from "../../../services/general/getMediaList";

//=================== Permission ===================
import { subscriptionPermission } from "../../../middleware/authorization/subscriptionPermission";

//=================== Route ===================

router.post(
  "/commonPrompt",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: commonPrompt,
    isRequestValidateRequired: true,
    schemaValidate: commonPromptSchema,
  })
);

router.post(
  "/editPostPrompt",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: editPostPrompt,
    isRequestValidateRequired: true,
    schemaValidate: editPostPromptSchema,
  })
);

router.post(
  "/rewritePostPrompt",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: rewritePostPrompt,
    isRequestValidateRequired: true,
    schemaValidate: rewritePostPromptSchema,
  })
);

router.post(
  "/generateDIYPostPrompt",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: generateDIYPostPrompt,
    isRequestValidateRequired: true,
    schemaValidate: generateDIYPostPromptSchema,
  })
);

router.post(
  "/uploadFile",
  userAuthentication.bind({}),
  uploadS3Fn,
  uploadS3File
);

router.post(
  "/contentMarked",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: contentMarked,
    isRequestValidateRequired: true,
    schemaValidate: contentMarkedSchema,
  })
);

router.post(
  "/contentAnalyze",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: contentAnalyze,
    isRequestValidateRequired: true,
    schemaValidate: contentAnalyzeSchema,
  })
);

router.post(
  "/contentHumanize",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: contentHumanize,
    isRequestValidateRequired: true,
    schemaValidate: contentHumanizeSchema,
  })
);

router.post(
  "/getLinkPreview",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: getLinkPreview,
    isRequestValidateRequired: true,
    schemaValidate: getLinkPreviewSchema,
  })
);

router.post(
  "/getMediaList",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: getMediaList,
    isRequestValidateRequired: true,
    schemaValidate: getMediaListSchema,
  })
);

export default router;
