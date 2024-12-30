import { Router } from "express";
import commonResolver from "../../../utilities/commonResolver";
import userAuthentication from "../../../middleware/authentication/userAuthentication";

const router = new Router();

//=================== Schema ===================
import { generateCreativeSchema } from "./generateCreative";
import { getAdCreativeTemplatesSchema } from "./getAdCreativeTemplates";
import { getPresetAdCreativeTemplateSchema } from "./getPresetAdCreativeTemplate";
import { saveTemplateSchema } from "./saveTemplate";
import { updateTemplateSchema } from "./updateTemplate";
import { updateTitleSchema } from "./updateTitle";
import { deleteCustomTemplateSchema } from "./deleteTemplate";
import { getAllTemplateSchema } from "./getAllTemplate";
import { getTemplateSchema } from "./getTemplate";
import { generateAdCreativeContentSchema } from "./generateAdCreativeContent";

//=================== Services ===================
import { generateCreative } from "../../../services/adCreative/generateCreative";
import { getAdCreativeTemplates } from "../../../services/adCreative/getAdCreativeTemplates";
import { getPresetAdCreativeTemplate } from "../../../services/adCreative/getPresetAdCreativeTemplate";
import { saveTemplate } from "../../../services/adCreative/saveTemplate";
import { updateTemplate } from "../../../services/adCreative/updateTemplate";
import { updateTitle } from "../../../services/adCreative/updateTitle";
import { deleteTemplate } from "../../../services/adCreative/deleteTemplate";
import { getAllTemplate } from "../../../services/adCreative/getAllTemplate";
import { getTemplate } from "../../../services/adCreative/getTemplate";
import { generateAdCreativeContent } from "../../../services/adCreative/generateAdCreativeContent";
import { getvisualCreativesTemplate } from "../../../services/adCreative/getvisualCreativesTemplate";

//=================== Route ===================

router.post(
  "/generateCreative",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: generateCreative,
    isRequestValidateRequired: true,
    schemaValidate: generateCreativeSchema,
  })
);

router.post(
  "/getAdCreativeTemplates",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: getAdCreativeTemplates,
    isRequestValidateRequired: true,
    schemaValidate: getAdCreativeTemplatesSchema,
  })
);

router.post(
  "/getPresetAdCreativeTemplate",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: getPresetAdCreativeTemplate,
    isRequestValidateRequired: true,
    schemaValidate: getPresetAdCreativeTemplateSchema,
  })
);

router.post(
  "/saveTemplate",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: saveTemplate,
    isRequestValidateRequired: true,
    schemaValidate: saveTemplateSchema,
  })
);

router.post(
  "/updateTemplate",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: updateTemplate,
    isRequestValidateRequired: true,
    schemaValidate: updateTemplateSchema,
  })
);

router.post(
  "/updateTitle",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: updateTitle,
    isRequestValidateRequired: true,
    schemaValidate: updateTitleSchema,
  })
);

router.post(
  "/getAllTemplate",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: getAllTemplate,
    isRequestValidateRequired: true,
    schemaValidate: getAllTemplateSchema,
  })
);

router.post(
  "/getTemplate",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: getTemplate,
    isRequestValidateRequired: true,
    schemaValidate: getTemplateSchema,
  })
);

router.post(
  "/deleteTemplate",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: deleteTemplate,
    isRequestValidateRequired: true,
    schemaValidate: deleteCustomTemplateSchema,
  })
);

router.post(
  "/generateAdCreativeContent",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: generateAdCreativeContent,
    isRequestValidateRequired: true,
    schemaValidate: generateAdCreativeContentSchema,
  })
);

router.post(
  "/getvisualCreativesTemplate",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: getvisualCreativesTemplate,
    isRequestValidateRequired: true,
    schemaValidate: getAllTemplateSchema,
  })
);

export default router;
