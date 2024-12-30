let request = require("request");

export const genrateVideoRequest = async (entry) => {
  let { url, topic, color, collection, ratio, length, voice } = entry;

  let baseUrl = "https://stg-api.identable.club/";
  if (process.env.NODE_ENV == "production") {
    baseUrl = "https://api.identable.club/";
  }

  let webhookUrl = `${baseUrl}api/v1/aivideo/renderAiVideo`;

  let body = {
    length: length,
    color: color,
    collection: collection,
    ratio: ratio,
    voice: voice,
    draft: false,
    webhook_url: webhookUrl,
  };

  if (url) {
    body = {
      ...body,
      url: url,
      prompt: "",
    };
  } else {
    body = {
      ...body,
      prompt: topic,
    };
  }

  let authUrl =
    "https://api.vidon.ai/v1/template/prompt?api_key=" +
    process.env.AI_VIDEO_API_KEY;
  if (url) {
    authUrl =
      "https://api.vidon.ai/v1/template/url-to-video?api_key=" +
      process.env.AI_VIDEO_API_KEY;
  }

  return new Promise(function (resolve, reject) {
    let options = {
      method: "POST",
      url: authUrl,
      headers: {
        "content-type": "application/json",
      },
      body: body,
      json: true,
    };

    request(options, function (err, response, body) {
      try {
        if (err) {
          console.error("genrateVideoRequest 1 Error = ", err);
        } else {
          if (response.statusCode == 200) {
            resolve({ status: true, data: response?.body });
            return;
          } else {
            console.error("genrateVideoRequest 2 Error = ", response?.body);
            resolve({ status: false, message: response?.body?.message });
            return;
          }
        }
      } catch (error) {
        console.error("genrateVideoRequest 3 Error = ", error);
      }
      resolve({ status: false, message: "something went wrong" });
      return;
    });
  });
};
