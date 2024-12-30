const SUBSCRIPTION_STATUS = {
  TRIAL: "trial",
  ACTIVE: "active",
  CANCEL: "cancel",
};

const CANCEL_REASON = {
  PAYMENT_FAILED: "PaymentFailed",
  TRIAL_END: "TrialEnd",
  BY_USER: "ByUser",
  BY_ADMIN: "ByAdmin",
  SUBSCRIPTION_CANCELLED: "SubscriptionCancelled",
};

const RECURRING_TYPE = {
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

const PLAN = {
  TRY_IT_ON: "65a8011c9374a1eeaab60d1b",
  YOUR_GROWING: "65a8010b9374a1eeaab60d1a",
  MASTER: "65a800e39374a1eeaab60d19",
};

const POST_MEDIA_TYPE = {
  IMAGE: "image",
  VIDEO: "video",
  GIPHY: "giphy",
  CAROUSEL: "carousel",
  AI_VIDEO: "aivideo",
};

const POST_GENERATE_TYPE = {
  INSPIRE_ME: "inspireMe",
  TRENDING_NEWS: "trendingNews",
  DIY_STRATEGY: "diyStrategy",
  CAROUSEL: "carousel",
  AI_VIDEO: "aivideo",
  ONE_CLICK: "oneClick",
  ARTICLE: "article",
};

const POST_STATUS = {
  POSTED: "posted",
  SCHEDULED: "scheduled",
  POSTING: "posting",
  DRAFT: "draft",
  ERROR: "error",
};

const BOOST_STATUS = {
  BOOSTED: "boosted",
  SCHEDULED: "scheduled",
  BOOSTING: "boosting",
  ERROR: "error",
};

const POST_BOOST_STATUS = {
  SCHEDULED: "scheduled",
  PROCESSING: "processing",
  COMPLETED: "completed",
};

const CAMPAIGN_TYPE = {
  LINKEDIN_SEARCH: 1,
  SALES_NAVIGATOR: 2,
};

const CONNECTION_STATUS = {
  PROFILE_VISITNG: "profileVising",
  PROFILE_VISITED: "profileVisited",
  COMMENTING: "commenting",
  COMMENTED: "commented",
  FOLLOWING: "following",
  FOLLOWED: "followed",
  CONNECTING: "connecting",
  CONNECTED: "connected",
  IGNORED: "ignored",
  DROPPED: "dropped",
};

const ONE_CLICK_CAMPAIGN_STATUS = {
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

const CONNECTION_JOB_TYPE = {
  VISIT_PROFILE: "visit_profile",
  INTERACT_WITH_RECENT_POST: "interact_with_recent_post",
  FOLLOW_USER: "follow_user",
  SEND_CONNECTION_REQUEST: "send_connection_request",
};

const INSPIREME_TYPE = {
  Industry_Trend: "IndustryTrend",
  ThoughtLeadership: "ThoughtLeadership",
  ProductivityHacks: "ProductivityHacks",
  ProfessionalTips: "ProfessionalTips",
  IndustryPrediction: "IndustryPrediction",
};

const CREDIT_TYPE = {
  AI_IMAGE: "aiImage",
  AI_VIDEO: "aiVideo",
  CAROUSEL: "carousel",
  ADVANCE_SCHEDULE: "advanceSchedule",
  BOOSTING: "boosting",
  DISCOVER_EMAIL: "discoverEmail",
  ARTICLE: "article",
  TRENDING_NEWS_SEARCH: "trendingNewsSearch",
  ONE_CLICK: "oneClick",
  CONTENT_ANALYZE: "contentAnalyze",
  CONTENT_HUMANIZE: "contentHumanize",
  BOOSTING_CAMPAIGN: "boostingCampaign",
  ARTICLE_SEO_SCORE: "articleSEOScore",
  ARTICLE_SEO_OPTIMIZE: "articleSEOOptimize",
};

const PREVIEW_DATA = {
  USER_ID: "668ca70ee530040031986342",
  PAGE_ID: "668ca789e530040031986382",
};

const FOLLOW_STATUS = {
  QUEUE: "queue",
  SENT: "sent",
  UNFOLLOWED: "unfollowed",
};

module.exports = {
  SUBSCRIPTION_STATUS,
  CANCEL_REASON,
  RECURRING_TYPE,
  PLAN,
  POST_MEDIA_TYPE,
  POST_GENERATE_TYPE,
  POST_STATUS,
  BOOST_STATUS,
  POST_BOOST_STATUS,
  CAMPAIGN_TYPE,
  CONNECTION_STATUS,
  CONNECTION_JOB_TYPE,
  ONE_CLICK_CAMPAIGN_STATUS,
  CREDIT_TYPE,
  PREVIEW_DATA,
  FOLLOW_STATUS,
  INSPIREME_TYPE,
};
