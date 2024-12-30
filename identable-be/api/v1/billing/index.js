import { Router } from "express";
import commonResolver from "../../../utilities/commonResolver";
import userAuthentication from "../../../middleware/authentication/userAuthentication";

const router = new Router();

//=================== Schema ===================
import { checkoutSessionSchema } from "./checkoutSession";
import { cancelSubscriptionSchema } from "./cancelSubscription";
import { addCardSchema } from "./addCard";
import { updateCardSchema } from "./updateCard";
import { deleteCardSchema } from "./deleteCard";
import { setDefaultCardSchema } from "./setDefaultCard";
import { cardListSchema } from "./cardList";
import { manageSubscriptionSchema } from "./manageSubscription"; 
import { buyCreditSchema } from "./buyCredit"; 

//=================== Services ===================
import { createCheckoutSession } from "../../../services/billing/createCheckoutSession";
import { cancelSubscription } from "../../../services/billing/cancelSubscription";
import { add } from "../../../services/billing/addCard";
import { update } from "../../../services/billing/updateCard";
import { deleteCard } from "../../../services/billing/deleteCard";
import { setDefult } from "../../../services/billing/setDefaultCard";
import { cardList } from "../../../services/billing/cardList";
import { manageSubscription } from "../../../services/billing/manageSubscription";
import { buyCredit } from "../../../services/billing/buyCredit";

//=================== Permission ===================

//=================== Route ===================

router.post(
  "/checkoutSession",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: createCheckoutSession,
    isRequestValidateRequired: true,
    schemaValidate: checkoutSessionSchema,
  })
);

router.get(
  "/cancelSubscription",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: cancelSubscription,
    isRequestValidateRequired: true,
    schemaValidate: cancelSubscriptionSchema,
  })
);

router.post(
  "/add",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: add,
    isRequestValidateRequired: true,
    schemaValidate: addCardSchema,
  })
);

router.post(
  "/update",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: update,
    isRequestValidateRequired: true,
    schemaValidate: updateCardSchema,
  })
);

router.post(
  "/delete",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: deleteCard,
    isRequestValidateRequired: true,
    schemaValidate: deleteCardSchema,
  })
);

router.post(
  "/setDefult",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: setDefult,
    isRequestValidateRequired: true,
    schemaValidate: setDefaultCardSchema,
  })
);

router.post(
  "/list",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: cardList,
    isRequestValidateRequired: true,
    schemaValidate: cardListSchema,
  })
);

router.post(
  "/manageSubscription",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: manageSubscription,
    isRequestValidateRequired: true,
    schemaValidate: manageSubscriptionSchema,
  })
);

router.post(
  "/buyCredit",
  userAuthentication.bind({}),
  commonResolver.bind({
    modelService: buyCredit,
    isRequestValidateRequired: true,
    schemaValidate: buyCreditSchema,
  })
);

export default router;
