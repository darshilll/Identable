import { Router } from "express";
import commonResolver from "../../../utilities/commonResolver";

const router = new Router();

//=================== Schema ===================
import { subscriptionWebhookSchema } from "./subscriptionWebhook";

//=================== Services ===================
import { subscriptionWebhook } from "../../../services/webhook/subscriptionWebhook";

//=================== Route ===================

router.post(
  "/subscription",
  commonResolver.bind({
    modelService: subscriptionWebhook,
    isRequestValidateRequired: false,
    schemaValidate: subscriptionWebhookSchema,
  })
);

export default router;
