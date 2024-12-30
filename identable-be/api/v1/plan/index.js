import { Router } from "express";
import commonResolver from "../../../utilities/commonResolver";
import userAuthentication from "../../../middleware/authentication/userAuthentication";

const router = new Router();

//=================== Schema ===================
import { getPlanListSchema } from "./getPlanList";

//=================== Services ===================
import { getPlanList } from "../../../services/plan/getPlanList";

//=================== Permission ===================

//=================== Route ===================

router.get(
  "/list",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: getPlanList,
    isRequestValidateRequired: true,
    schemaValidate: getPlanListSchema,
  })
);

export default router;
