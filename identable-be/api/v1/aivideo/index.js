import { Router } from "express";
import commonResolver from "../../../utilities/commonResolver";
import userAuthentication from "../../../middleware/authentication/userAuthentication";

const router = new Router();

//=================== Schema ===================

import { saveAivideoSchema } from "./saveAivideo";
import { getVideoListSchema } from "./getVideoList";
import { getAudioListSchema } from "./getAudioList";
import { aiVideoDeleteSchema } from "./aiVideoDelete";

//=================== Services ===================

import { genratedVideo } from "../../../services/aivideo/genratedVideo";
import { renderAiVideo } from "../../../services/aivideo/renderAiVideo";
import { getVideoList } from "../../../services/aivideo/getVideoList";
import { getAudioList } from "../../../services/aivideo/getAudioList";
import { aiVideoDelete } from "../../../services/aivideo/aiVideoDelete";

//=================== Permission ===================
import { subscriptionPermission } from "../../../middleware/authorization/subscriptionPermission";

//=================== Route ===================

router.post(
  "/genratedVideo",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: genratedVideo,
    isRequestValidateRequired: true,
    schemaValidate: saveAivideoSchema,
  })
);

router.post(
  "/renderAiVideo",
  commonResolver.bind({
    modelService: renderAiVideo,
    isRequestValidateRequired: false,
  })
);

router.post(
  "/getVideoList",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: getVideoList,
    isRequestValidateRequired: true,
    schemaValidate: getVideoListSchema,
  })
);

router.post(
  "/getAudioList",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: getAudioList,
    isRequestValidateRequired: true,
    schemaValidate: getAudioListSchema,
  })
);

router.post(
  "/aiVideoDelete",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: aiVideoDelete,
    isRequestValidateRequired: true,
    schemaValidate: aiVideoDeleteSchema,
  })
);


export default router;
