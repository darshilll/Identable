import { Router } from "express";
import commonResolver from "../../../utilities/commonResolver";
import userAuthentication from "../../../middleware/authentication/userAuthentication";

const router = new Router();

//=================== Schema ===================

import { generateAIImageSchema } from "./generateAIImage";
import { getImageListSchema } from "./getImageList";
import { generateImageSchema } from "./generateImage";
import { getAIImageIdeaSchema } from "./getAIImageIdea";
import { getAIImagesByDateSchema } from "./getAIImagesByDate";

//=================== Services ===================

import { generateAIImage } from "../../../services/aiimage/generateAIImage";
import { getAIImages } from "../../../services/aiimage/getAIImages";
import { generateImage } from "../../../services/aiimage/generateImage";
import { getAIImageIdea } from "../../../services/aiimage/getAIImageIdea";
import { getAIImagesByDate } from "../../../services/aiimage/getAIImagesByDate";

//=================== Permission ===================
import { subscriptionPermission } from "../../../middleware/authorization/subscriptionPermission";

//=================== Route ===================

router.post(
  "/generateAIImage",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: generateAIImage,
    isRequestValidateRequired: true,
    schemaValidate: generateAIImageSchema,
  })
);

router.post(
  "/getAIImage",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: getAIImages,
    isRequestValidateRequired: true,
    schemaValidate: getImageListSchema,
  })
);

router.post(
  "/generateImage",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: generateImage,
    isRequestValidateRequired: true,
    schemaValidate: generateImageSchema,
  })
);

router.post(
  "/getAIImageIdea",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: getAIImageIdea,
    isRequestValidateRequired: true,
    schemaValidate: getAIImageIdeaSchema,
  })
);

router.post(
  "/getAIImagesByDate",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: getAIImagesByDate,
    isRequestValidateRequired: true,
    schemaValidate: getAIImagesByDateSchema,
  })
);

export default router;
