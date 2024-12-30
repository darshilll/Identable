let request = require("request");

const jobTaskUrl = process.env.AUTOMATION_JOB_ENDPOINT;

import { createJobRequestId } from "../../services/job/createJobRequestId";
import { saveJobRequestData } from "../../services/job/saveJobRequestData";
import { saveJobTriggerResponse } from "../../services/job/saveJobTriggerResponse";

export const scrapePostAnalyticsJob = async (entry) => {
  let { userId, pageId, cookies, cookiesExpiry, userAgent, proxy, postIds } =
    entry;

  const jobRequestId = await createJobRequestId({
    userId: userId,
  });

  let body = {
    cookies: cookies,
    cookies_expiry: cookiesExpiry,
    user_agent: userAgent,
    user_id: userId,
    page_id: pageId,
    proxy: proxy,
    jobRequestId: jobRequestId,
    job_type: "SCRAPE_POST_ANALYTICS",
    post_ids: JSON.stringify(postIds),
  };

  await saveJobRequestData({
    jobRequestId: jobRequestId,
    submitData: body,
  });

  return new Promise(function (resolve, reject) {
    let options = {
      method: "POST",
      url: jobTaskUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + process.env.AUTOMATION_JOB_TOKEN,
      },
      body: body,
      json: true,
    };

    request(options, async function (err, response, body) {
      try {
        if (err) {
          await saveJobTriggerResponse({
            jobRequestId: jobRequestId,
            jobTriggerResponse: null,
            jobTriggerError: err,
          });
        } else {
          await saveJobTriggerResponse({
            jobRequestId: jobRequestId,
            jobTriggerResponse: response?.body,
            jobTriggerError: null,
          });
          if (response.statusCode == 200) {
            resolve(true);
            return;
          }
        }
      } catch (error) {
        await saveJobTriggerResponse({
          jobRequestId: jobRequestId,
          jobTriggerResponse: null,
          jobTriggerError: error,
        });
      }
      resolve(false);
    });
  });
};
