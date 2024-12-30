let request = require("request");

import { createJobRequestId } from "../../../services/job/createJobRequestId";
import { saveJobRequestData } from "../../../services/job/saveJobRequestData";
import { saveJobTriggerResponse } from "../../../services/job/saveJobTriggerResponse";

const jobTaskUrl = process.env.AUTOMATION_JOB_ENDPOINT;

export const interactwithRecentPostJob = async (entry) => {
  let {
    userId,
    pageId,
    cookies,
    cookiesExpiry,
    userAgent,
    proxy,
    campaignId,
    profileArray,
  } = entry;

  const jobRequestId = await createJobRequestId({
    userId: userId,
  });

  let body = {
    cookies: cookies,
    cookies_expiry: cookiesExpiry,
    user_agent: userAgent,
    user_id: userId,
    job_type: "INITIATE_LINKEDIN_CONNECTIONS",
    proxy: proxy,
    page_id: pageId,
    campaign_id: campaignId,
    connection_request_profiles: profileArray,
    jobRequestId: jobRequestId,
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
