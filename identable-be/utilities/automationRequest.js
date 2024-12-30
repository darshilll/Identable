let request = require("request");
import { POST_GENERATE_TYPE } from "../utilities/constants";
import { createJobRequestId } from "../services/job/createJobRequestId";
import { saveJobRequestData } from "../services/job/saveJobRequestData";
import { saveJobTriggerResponse } from "../services/job/saveJobTriggerResponse";

const jobTaskUrl = process.env.AUTOMATION_JOB_ENDPOINT;

export const scrapeLinkedinUserDataJob = async (entry) => {
  let { userId, cookies, cookiesExpiry, userAgent, proxy } = entry;

  const jobRequestId = await createJobRequestId({
    userId: userId,
  });

  let body = {
    cookies: cookies,
    cookies_expiry: cookiesExpiry,
    user_agent: userAgent,
    user_id: userId,
    job_type: "SCRAPE_INTEGRATION_DATA",
    proxy: proxy,
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
          if (response.statusCode == 200) {
            await saveJobTriggerResponse({
              jobRequestId: jobRequestId,
              jobTriggerResponse: response?.body,
              jobTriggerError: null,
            });
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

export const scrapePostDataJob = async (entry) => {
  let { userId, pageId, cookies, cookiesExpiry, userAgent, proxy, companyUrl } =
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
    job_type: "SCRAPE_ALL_POSTS",
  };
  if (companyUrl) {
    body = {
      ...body,
      company_url: companyUrl,
    };
  }
  await saveJobRequestData({
    jobRequestId: jobRequestId,
    submitData: body,
  });

  return new Promise(function (resolve, reject) {
    let options = {
      method: "POST",
      url: "https://stage-scrapper.identable.club/trigger-job-task",
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
          if (response.statusCode == 200) {
            await saveJobTriggerResponse({
              jobRequestId: jobRequestId,
              jobTriggerResponse: response?.body,
              jobTriggerError: null,
            });
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

export const schedulePostData = async (entry) => {
  let {
    userId,
    cookies,
    cookiesExpiry,
    userAgent,
    postBody,
    postMedia,
    postId,
    generatedType,
    pageId,
    proxy,
    documentDescription,
    companyUrl,
  } = entry;

  const jobRequestId = await createJobRequestId({
    userId: userId,
  });

  let body = {
    cookies: cookies,
    cookies_expiry: cookiesExpiry,
    user_agent: userAgent,
    user_id: userId,
    job_type: "SCHEDULE_POST",
    post_text: postBody,
    media_url: postMedia,
    post_id: postId,
    proxy: proxy,
    jobRequestId: jobRequestId,
  };
  if (generatedType == POST_GENERATE_TYPE.CAROUSEL) {
    body = {
      ...body,
      document_description: documentDescription,
    };
  }
  if (companyUrl) {
    body = {
      ...body,
      company_url: companyUrl,
    };
  }
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

export const scheduleArticleData = async (entry) => {
  let {
    userId,
    cookies,
    cookiesExpiry,
    userAgent,
    postBody,
    postMedia,
    postId,
    generatedType,
    articleHeadline,
    articleTitle,
    pageId,
    proxy,
    companyUrl,
    articleContentArray,
  } = entry;

  const jobRequestId = await createJobRequestId({
    userId: userId,
  });

  let body = {
    cookies: cookies,
    cookies_expiry: cookiesExpiry,
    user_agent: userAgent,
    user_id: userId,
    page_id: pageId,
    job_type: "NEW_SCHEDULE_ARTICLE",
    article_title: articleTitle,
    article_content: JSON.stringify(articleContentArray),
    article_image_url: postMedia,
    article_headline: articleHeadline,
    post_id: postId,
    proxy: proxy,
    jobRequestId: jobRequestId,
  };

  if (companyUrl) {
    body = {
      ...body,
      company_url: companyUrl,
    };
  }

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

export const scheduleBoostingPost = async (entry) => {
  let {
    userId,
    cookies,
    cookiesExpiry,
    postUrl,
    proxy,
    companyUrl,
    userAgent,
  } = entry;

  const jobRequestId = await createJobRequestId({
    userId: userId,
  });

  let body = {
    cookies: cookies,
    cookies_expiry: cookiesExpiry,
    user_agent: userAgent,
    user_id: userId,
    job_type: "BOOST_POST",
    post_url: postUrl,
    reaction_type: "Like",
    proxy: proxy,
    jobRequestId: jobRequestId,
  };

  // if (companyUrl) {
  //   body = {
  //     ...body,
  //     company_url: companyUrl,
  //   };
  // }

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
