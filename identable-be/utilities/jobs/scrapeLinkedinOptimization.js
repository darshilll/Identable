let request = require("request");

const jobTaskUrl = process.env.AUTOMATION_JOB_ENDPOINT;

import { createJobRequestId } from "../../services/job/createJobRequestId";
import { saveJobRequestData } from "../../services/job/saveJobRequestData";
import { saveJobTriggerResponse } from "../../services/job/saveJobTriggerResponse";

export const scrapeLinkedinOptimization = async (entry) => {
  const {
    cookies,
    cookiesExpiry,
    userAgent,
    userId,
    pageId,
    proxy = "",
    postIds = "[]",
    optimizeActions,
  } = entry;

  // Generate a unique job request ID
  const jobRequestId = await createJobRequestId({
    userId: userId,
  });

  // Prepare the body for the automation job
  const body = {
    cookies,
    cookies_expiry: cookiesExpiry,
    user_agent: userAgent,
    user_id: userId,
    job_type: "OPTIMIZE_PROFILE",
    proxy,
    page_id: pageId,
    jobRequestId,
    post_ids: postIds,
    OPTIMIZE_ACTIONS: JSON.stringify(optimizeActions),
  };

  // Save the job request data for tracking
  await saveJobRequestData({
    jobRequestId: jobRequestId,
    submitData: body,
  });

  // Return a promise for the job execution
  return new Promise((resolve, reject) => {
    const options = {
      method: "POST",
      url: jobTaskUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + process.env.AUTOMATION_JOB_TOKEN,
      },
      body: body,
      json: true,
      timeout:3000,
    };

    request(options, async (err, response) => {
      try {
        if (err) {
          await saveJobTriggerResponse({
            jobRequestId: jobRequestId,
            jobTriggerResponse: null,
            jobTriggerError: err,
          });
          reject(err);
        } else {
          await saveJobTriggerResponse({
            jobRequestId: jobRequestId,
            jobTriggerResponse: response?.body,
            jobTriggerError: null,
          });

          if (response.statusCode === 200) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      } catch (error) {
        await saveJobTriggerResponse({
          jobRequestId: jobRequestId,
          jobTriggerResponse: null,
          jobTriggerError: error,
        });
        reject(error);
      }
    });
  });
};
