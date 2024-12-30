import { Router } from "express";
import commonResolver from "../../../utilities/commonResolver";
import userAuthentication from "../../../middleware/authentication/userAuthentication";

const router = new Router();

//=================== Schema ===================
import { getThemeSchema } from "./getTheme";
import { addThemeSchema } from "./addTheme";
import { updateThemeSchema } from "./updateTheme";
import { generateCarouselSchema } from "./generateCarousel";
import { getCarouselSchema } from "./getCarousel";

import { carouselGenerateSchema } from "./carouselGenerate";
import { saveCustomTemplateSchema } from "./saveCustomTemplate";
import { getCustomTemplateSchema } from "./getCustomTemplate";
import { getAllCustomTemplateSchema } from "./getAllCustomTemplate";
import { updateCarouselNameSchema } from "./updateCarouselName";
import { deleteCustomTemplateSchema } from "./deleteCustomTemplate";
import { getPresetCarouselTemplateSchema } from "./getPresetCarouselTemplate";
import { generateCarouselSlideSchema } from "./generateCarouselSlide";
import { generateCarouselContentSchema } from "./generateCarouselContent";
import { updateCustomTemplateSchema } from "./updateCustomTemplate";

//=================== Services ===================
import { getTheme } from "../../../services/carousel/getTheme";
import { addTheme } from "../../../services/carousel/addTheme";
import { updateTheme } from "../../../services/carousel/updateTheme";
import { deleteTheme } from "../../../services/carousel/deleteTheme";
import { generateCarousel } from "../../../services/carousel/generateCarousel";
import { getCarousel } from "../../../services/carousel/getCarousel";

import { carouselGenerate } from "../../../services/carousel/carouselGenerate";
import { saveCustomTemplate } from "../../../services/carousel/saveCustomTemplate";
import { getCustomTemplate } from "../../../services/carousel/getCustomTemplate";
import { getAllCustomTemplate } from "../../../services/carousel/getAllCustomTemplate";
import { updateCarouselName } from "../../../services/carousel/updateCarouselName";
import { deleteCustomTemplate } from "../../../services/carousel/deleteCustomTemplate";
import { getPresetCarouselTemplate } from "../../../services/carousel/getPresetCarouselTemplate";
import { generateCarouselSlide } from "../../../services/carousel/generateCarouselSlide";
import { generateCarouselContent } from "../../../services/carousel/generateCarouselContent";
import { updateCustomTemplate } from "../../../services/carousel/updateCustomTemplate";

//=================== Permission ===================
import { subscriptionPermission } from "../../../middleware/authorization/subscriptionPermission";

//=================== Route ===================

router.get(
  "/getTheme",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: getTheme,
    isRequestValidateRequired: true,
    schemaValidate: getThemeSchema,
  })
);

router.post(
  "/addTheme",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: addTheme,
    isRequestValidateRequired: true,
    schemaValidate: addThemeSchema,
  })
);

router.post(
  "/updateTheme",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: updateTheme,
    isRequestValidateRequired: true,
    schemaValidate: updateThemeSchema,
  })
);

router.delete(
  "/deleteTheme/:id",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: deleteTheme,
    isRequestValidateRequired: false,
  })
);

router.post(
  "/generateCarousel",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: generateCarousel,
    isRequestValidateRequired: true,
    schemaValidate: generateCarouselSchema,
  })
);

router.post(
  "/getCarousel",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: getCarousel,
    isRequestValidateRequired: true,
    schemaValidate: getCarouselSchema,
  })
);

// ** New APi
router.post(
  "/carouselGenerate",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: carouselGenerate,
    isRequestValidateRequired: true,
    schemaValidate: carouselGenerateSchema,
  })
);

router.post(
  "/saveCustomTemplate",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: saveCustomTemplate,
    isRequestValidateRequired: true,
    schemaValidate: saveCustomTemplateSchema,
  })
);

router.post(
  "/getCustomTemplate",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: getCustomTemplate,
    isRequestValidateRequired: true,
    schemaValidate: getCustomTemplateSchema,
  })
);

router.post(
  "/getAllCustomTemplate",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: getAllCustomTemplate,
    isRequestValidateRequired: true,
    schemaValidate: getAllCustomTemplateSchema,
  })
);

router.post(
  "/updateCustomTemplate",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: updateCustomTemplate,
    isRequestValidateRequired: true,
    schemaValidate: updateCustomTemplateSchema,
  })
);

router.post(
  "/updateCarouselName",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: updateCarouselName,
    isRequestValidateRequired: true,
    schemaValidate: updateCarouselNameSchema,
  })
);

router.post(
  "/deleteCustomTemplate",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: deleteCustomTemplate,
    isRequestValidateRequired: true,
    schemaValidate: deleteCustomTemplateSchema,
  })
);

router.post(
  "/getPresetCarouselTemplate",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: getPresetCarouselTemplate,
    isRequestValidateRequired: true,
    schemaValidate: getPresetCarouselTemplateSchema,
  })
);

router.post(
  "/generateCarouselSlide",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: generateCarouselSlide,
    isRequestValidateRequired: true,
    schemaValidate: generateCarouselSlideSchema,
  })
);

router.post(
  "/generateCarouselContent",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: generateCarouselContent,
    isRequestValidateRequired: true,
    schemaValidate: generateCarouselContentSchema,
  })
);

export default router;
