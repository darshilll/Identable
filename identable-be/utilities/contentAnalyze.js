let request = require("request");

export const genrateContentAnalyze = async (entry) => {
  let { content } = entry;

  let body = {
    text: content,
  };

  let authUrl =
    "https://the-ghost-ai-backend-005c5dcbf4a6.herokuapp.com/detection/ai/";

  return new Promise(function (resolve, reject) {
    let options = {
      method: "POST",
      url: authUrl,
      headers: {
        Authorization: "Api-Key TPqqKE63.tY34rxmzZdA0st3JU2fXOjyXrEHjoEug",
      },
      body: body,
      json: true,
    };

    request(options, function (err, response, body) {
      try {
        if (err) {
          console.error("genrateContentAnalyze Error = ", err);
        } else {
          if (response.statusCode == 200) {
            resolve({ status: true, data: response?.body });
            return;
          } else {
            resolve({ status: false, message: response?.body?.message });
            return;
          }
        }
      } catch (error) {
        console.error("genrateContentAnalyze Error = ", error);
      }
      resolve({ status: false, message: "something went wrong" });
      return;
    });
  });
};

export const genrateHumanizerContent = async (entry) => {
  let { content } = entry;

  let body = {
    text: content,
    humanizerIntensity: "HIGH",
    purpose: "GENERAL",
    literacyLevel: "COLLEGE",
  };

  let authUrl =
    "https://the-ghost-ai-backend-005c5dcbf4a6.herokuapp.com/transformations/humanize/";

  return new Promise(function (resolve, reject) {
    let options = {
      method: "POST",
      url: authUrl,
      headers: {
        Authorization: "Api-Key TPqqKE63.tY34rxmzZdA0st3JU2fXOjyXrEHjoEug",
      },
      body: body,
      json: true,
    };

    request(options, function (err, response, body) {
      try {
        if (err) {
          console.error("genrateHumanizerContent Error = ", err);
        } else {
          if (response.statusCode == 200) {
            resolve({ status: true, data: response?.body });
            return;
          } else {
            resolve({ status: false, message: response?.body?.message });
            return;
          }
        }
      } catch (error) {
        console.error("genrateHumanizerContent Error = ", error);
      }
      resolve({ status: false, message: "something went wrong" });
      return;
    });
  });
};
