const cron = require("node-cron");

import { endTrialPeriod } from "../services/cron/endTrialPeriod";
import { schedulePost } from "../services/cron/schedulePost";
import { scrapePost } from "../services/cron/scrapePost";
import { oneClickPost } from "../services/cron/oneClickPost";
import { generateInspireMePost } from "../services/cron/generateInspireMePost";
import { processBoostingPost } from "../services/cron/processBoostingPost";
import { boostingPost } from "../services/cron/boostingPost";
import { scheduleInitiateConnection } from "../services/cron/crm/scheduleInitiateConnection";
import { scrapeLinkedinUserDetails } from "../services/cron/scrapeLinkedinUserDetails";
import { scrapePostAnalytics } from "../services/cron/scrapePostAnalytics";
import { scheduleCompanyProfileInvite } from "../services/cron/crm/scheduleCompanyProfileInvite";
import { scrapeLinkedinConnection } from "../services/cron/scrapeLinkedinConnection";

import { CONNECTION_JOB_TYPE } from "../utilities/constants";

// ==========  Every Day 2 AM ==========
// Trial Period End
cron.schedule("0 2 * * *", () => {
  endTrialPeriod();
});

// ==========  Every 15 Minues ==========
// Schedule Post
cron.schedule("*/15 * * * *", () => {
  boostingPost();
});

// ==========  Every 30 Minues ==========
// Schedule Post
cron.schedule("*/30 * * * *", () => {
  schedulePost();
  processBoostingPost();
});

// ==========  Every 1 Hours ==========

// Scrape Post
cron.schedule("0 * * * *", () => {
  scrapePost();
});

// ==========  Every 6 Hours ==========
// Generate One Click Post
cron.schedule("0 */6 * * *", () => {
  oneClickPost();
  generateInspireMePost();
});

// ==========  CRM ==========

// ==========  Every 1 Hours ==========

cron.schedule("0 * * * *", () => {
  scheduleCompanyProfileInvite();

  scheduleInitiateConnection({ jobType: CONNECTION_JOB_TYPE.VISIT_PROFILE });

  // After 10 min.
  setTimeout(() => {
    scheduleInitiateConnection({
      jobType: CONNECTION_JOB_TYPE.INTERACT_WITH_RECENT_POST,
    });
  }, 600000);

  // After 20 min.
  setTimeout(() => {
    scheduleInitiateConnection({ jobType: CONNECTION_JOB_TYPE.FOLLOW_USER });
  }, 1200000);

  scrapeLinkedinUserDetails();
  scrapePostAnalytics();
});

// ==========  Every 3 Hours ==========

cron.schedule("0 */3 * * *", () => {
  scheduleInitiateConnection({
    jobType: CONNECTION_JOB_TYPE.SEND_CONNECTION_REQUEST,
  });
});

// ==========  Every Sunday ==========

cron.schedule("0 * * * 0", () => {
  scrapeLinkedinConnection();
});
