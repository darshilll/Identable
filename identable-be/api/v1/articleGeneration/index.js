import { Router } from "express";
import commonResolver from "../../../utilities/commonResolver";
import userAuthentication from "../../../middleware/authentication/userAuthentication";

const router = new Router();

//=================== Schema ===================
import { generateTopicSchema } from "./generateTopic";
import { generateOutlineOutputSchema } from "./generateOutlineOutput";
import { generateArticleSchema } from "./generateArticle";

//=================== Services ===================
import { generateTopic } from "../../../services/articleGeneration/generateTopic";
import { generateOutlineOutput } from "../../../services/articleGeneration/generateOutlineOutput";
import { generateArticle } from "../../../services/articleGeneration/generateArticle";

//=================== Permission ===================
import { subscriptionPermission } from "../../../middleware/authorization/subscriptionPermission";

//=================== Route ===================

router.post(
  "/generateTopic",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: generateTopic,
    isRequestValidateRequired: true,
    schemaValidate: generateTopicSchema,
  })
);

router.post(
  "/generateOutlineOutput",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: generateOutlineOutput,
    isRequestValidateRequired: true,
    schemaValidate: generateOutlineOutputSchema,
  })
);

router.post(
  "/generateArticle",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: generateArticle,
    isRequestValidateRequired: true,
    schemaValidate: generateArticleSchema,
  })
);

export default router;
