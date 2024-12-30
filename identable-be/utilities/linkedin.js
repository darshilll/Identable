let request = require("request");

const clientId = "865wqg8vdzzscl";
const clientSecret = "35Tcqay0AmxZsgjI";

export const getLinkedinAccessToken = async (entry) => {
  let { code } = entry;

  return new Promise(function (resolve, reject) {
    var body = {
      grant_type: "authorization_code",
      code: code,
      redirect_uri: `${process.env.LIVE_URL}/auth/login`,
      client_id: clientId,
      client_secret: clientSecret,
    };

    request.post(
      { url: "https://www.linkedin.com/oauth/v2/accessToken", form: body },
      (err, response, body) => {
        var token = "";
        try {
          if (err) {
            console.error("getLinkedinAccessToken Error = ", err);
          } else {
            if (response.statusCode == 200) {
              let responseData = JSON.parse(response.body);
              token = responseData?.access_token;
            }
          }
        } catch (error) {
          console.error("getLinkedinAccessToken Error = ", error);
        }
        resolve(token);
      }
    );
  });
};

export const getLinkedinEmailDetails = async (entry) => {
  let { accessToken } = entry;

  return new Promise(function (resolve, reject) {
    let options = {
      method: "GET",
      url: "https://api.linkedin.com/v2/clientAwareMemberHandles?q=members&projection=(elements*(primary,type,handle~))",
      headers: {
        "content-type": "application/json",
        charset: "UTF-8",
        "cache-control": "no-cache",
        Authorization: "Bearer " + accessToken,
      },
      json: true,
    };

    request(options, function (err, response, body) {
      try {
        if (err) {
          console.error("getLinkedinEmailDetails Error = ", err);
        } else {
          if (response.statusCode == 200) {
            if (response?.body?.elements?.length > 0) {
              let elementDic = response?.body?.elements[0];
              let email = elementDic["handle~"]?.emailAddress;
              resolve(email);
              return;
            }
          }
        }
      } catch (error) {
        console.error("getLinkedinEmailDetails Error = ", error);
      }
      resolve(null);
    });
  });
};

export const getLinkedinProfileDetails = async (entry) => {
  let { accessToken } = entry;

  return new Promise(function (resolve, reject) {
    let options = {
      method: "GET",
      url: "https://api.linkedin.com/v2/me",
      headers: {
        "content-type": "application/json",
        charset: "UTF-8",
        "cache-control": "no-cache",
        Authorization: "Bearer " + accessToken,
      },
      json: true,
    };

    request(options, function (err, response, body) {
      try {
        if (err) {
          console.error("getLinkedinProfileDetails Error = ", err);
        } else {
          if (response.statusCode == 200) {
            resolve(response.body);
            return;
          }
        }
      } catch (error) {
        console.error("getLinkedinProfileDetails Error = ", error);
      }
      resolve(null);
    });
  });
};
