import { Router } from "express";
import commonResolver from "../../../utilities/commonResolver";
import userAuthentication from "../../../middleware/authentication/userAuthentication";

const router = new Router();

//=================== Schema ===================
import { getArticleListSchema } from "./getArticleList";
import { articleRenameSchema } from "./articleRename";
import { getArticleGoalSchema } from "./getArticleGoal";
import { articleDeleteSchema } from "./articleDelete";
import { getArticleIdeaSchema } from "./getArticleIdea";
import { regenerateArticleIdeaSchema } from "./regenerateArticleIdea";
import { getArticleKeywordsSchema } from "./getArticleKeywords";
import { getArticleHeadlineSchema } from "./getArticleHeadline";
import { regenerateArticleHeadlineSchema } from "./regenerateArticleHeadline";
import { getArticleOutlineOutputSchema } from "./getArticleOutlineOutput";
import { generateArticleSchema } from "./generateArticle";
import { regenerateArticleSchema } from "./regenerateArticle";
import { updateArticleSchema } from "./updateArticle";
import { getSEOScoreFeedbackSchema } from "./getSEOScoreFeedback";
import { generateTopicSchema } from "./generateTopic";
import { generateSubTopicSchema } from "./generateSubTopic";
import { getArticleDetailsSchema } from "./getArticleDetails";
import { generateOutlineSubTopicSchema } from "./generateOutlineSubTopic";
import { generateBannerImageSchema } from "./generateBannerImage";
import { optimizeSEOSchema } from "./optimizeSEO";

//=================== Services ===================
import { getArticleList } from "../../../services/article/getArticleList";
import { articleRename } from "../../../services/article/articleRename";
import { getArticleGoal } from "../../../services/article/getArticleGoal";
import { articleDelete } from "../../../services/article/articleDelete";
import { getArticleIdea } from "../../../services/article/getArticleIdea";
import { regenerateArticleIdea } from "../../../services/article/regenerateArticleIdea";
import { getArticleKeywords } from "../../../services/article/getArticleKeywords";
import { getArticleHeadline } from "../../../services/article/getArticleHeadline";
import { regenerateArticleHeadline } from "../../../services/article/regenerateArticleHeadline";
import { getArticleOutlineOutput } from "../../../services/article/getArticleOutlineOutput";
import { generateArticle } from "../../../services/article/generateArticle";
import { regenerateArticle } from "../../../services/article/regenerateArticle";
import { updateArticle } from "../../../services/article/updateArticle";
import { getSEOScoreFeedback } from "../../../services/article/getSEOScoreFeedback";
import { generateTopic } from "../../../services/article/generateTopic";
import { generateSubTopic } from "../../../services/article/generateSubTopic";
import { getArticleDetails } from "../../../services/article/getArticleDetails";
import { generateOutlineSubTopic } from "../../../services/article/generateOutlineSubTopic";
import { generateBannerImage } from "../../../services/article/generateBannerImage";
import { optimizeSEO } from "../../../services/article/optimizeSEO";
import { streamArticle } from "../../../services/article/streamArticle";

//=================== Permission ===================
import { subscriptionPermission } from "../../../middleware/authorization/subscriptionPermission";

//=================== Route ===================

router.post(
  "/getArticleList",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: getArticleList,
    isRequestValidateRequired: true,
    schemaValidate: getArticleListSchema,
  })
);

router.post(
  "/articleRename",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: articleRename,
    isRequestValidateRequired: true,
    schemaValidate: articleRenameSchema,
  })
);

router.post(
  "/getArticleGoal",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: getArticleGoal,
    isRequestValidateRequired: true,
    schemaValidate: getArticleGoalSchema,
  })
);

router.post(
  "/articleDelete",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: articleDelete,
    isRequestValidateRequired: true,
    schemaValidate: articleDeleteSchema,
  })
);

router.post(
  "/getArticleIdea",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: getArticleIdea,
    isRequestValidateRequired: true,
    schemaValidate: getArticleIdeaSchema,
  })
);

router.post(
  "/regenerateArticleIdea",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: regenerateArticleIdea,
    isRequestValidateRequired: true,
    schemaValidate: regenerateArticleIdeaSchema,
  })
);

router.post(
  "/getArticleKeywords",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: getArticleKeywords,
    isRequestValidateRequired: true,
    schemaValidate: getArticleKeywordsSchema,
  })
);

router.post(
  "/getArticleHeadline",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: getArticleHeadline,
    isRequestValidateRequired: true,
    schemaValidate: getArticleHeadlineSchema,
  })
);

router.post(
  "/regenerateArticleHeadline",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: regenerateArticleHeadline,
    isRequestValidateRequired: true,
    schemaValidate: regenerateArticleHeadlineSchema,
  })
);

router.post(
  "/getArticleOutlineOutput",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: getArticleOutlineOutput,
    isRequestValidateRequired: true,
    schemaValidate: getArticleOutlineOutputSchema,
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

router.post(
  "/regenerateArticle",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: regenerateArticle,
    isRequestValidateRequired: true,
    schemaValidate: regenerateArticleSchema,
  })
);

router.post(
  "/updateArticle",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: updateArticle,
    isRequestValidateRequired: true,
    schemaValidate: updateArticleSchema,
  })
);

router.post(
  "/getSEOScoreFeedback",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: getSEOScoreFeedback,
    isRequestValidateRequired: true,
    schemaValidate: getSEOScoreFeedbackSchema,
  })
);

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
  "/generateSubTopic",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: generateSubTopic,
    isRequestValidateRequired: true,
    schemaValidate: generateSubTopicSchema,
  })
);

router.post(
  "/getArticleDetails",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: getArticleDetails,
    isRequestValidateRequired: true,
    schemaValidate: getArticleDetailsSchema,
  })
);

router.post(
  "/generateOutlineSubTopic",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: generateOutlineSubTopic,
    isRequestValidateRequired: true,
    schemaValidate: generateOutlineSubTopicSchema,
  })
);

router.post(
  "/generateBannerImage",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: generateBannerImage,
    isRequestValidateRequired: true,
    schemaValidate: generateBannerImageSchema,
  })
);

router.post(
  "/optimizeSEO",
  userAuthentication.bind({}),
  subscriptionPermission,
  commonResolver.bind({
    modelService: optimizeSEO,
    isRequestValidateRequired: true,
    schemaValidate: optimizeSEOSchema,
  })
);

router.get(
  "/streamArticle",
  userAuthentication.bind({}),
  subscriptionPermission,
  streamArticle
);

export default router;
