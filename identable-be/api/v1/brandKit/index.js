import { Router } from "express";
import commonResolver from "../../../utilities/commonResolver";
import userAuthentication from "../../../middleware/authentication/userAuthentication";

const router = new Router();

//=================== Schema ===================
import { getBrandKitSchema } from "./getBrandKit";
import { saveBrandKitSchema } from "./saveBrandKit";
import { updateBrandKitSchema } from "./updateBrandKit";

//=================== Services ===================
import { getBrandKit } from "../../../services/brandKit/getBrandKit";
import { saveBrandKit } from "../../../services/brandKit/saveBrandKit";
import { updateBrandKit } from "../../../services/brandKit/updateBrandKit";

//=================== Permission ===================

//=================== Route ===================

router.post(
  "/list",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: getBrandKit,
    isRequestValidateRequired: true,
    schemaValidate: getBrandKitSchema,
  })
);

router.post(
  "/save",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: saveBrandKit,
    isRequestValidateRequired: true,
    schemaValidate: saveBrandKitSchema,
  })
);

router.post(
  "/update",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: updateBrandKit,
    isRequestValidateRequired: true,
    schemaValidate: updateBrandKitSchema,
  })
);

export default router;
