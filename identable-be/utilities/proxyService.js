let request = require("request");

const API_KEY = "o0e0g5q4blxwvv97s5k9aprbi66jly4ww73vya7y";

export const getReplacedProxyList = async (entry) => {
  return new Promise(function (resolve, reject) {
    const apiUrl = `https://proxy.webshare.io/api/v2/proxy/list/replaced/`;

    let options = {
      method: "GET",
      url: apiUrl,
      headers: {
        Authorization: `${API_KEY}`,
      },
      json: true,
    };

    request(options, function (err, response, body) {
      try {
        if (err) {
          console.error("getReplacedProxyList Error = ", err);
        } else {
          if (response.statusCode == 200) {
            resolve(response?.body?.results);
            return;
          }
        }
      } catch (error) {
        console.error("getReplacedProxyList Error = ", error);
      }
      resolve(null);
    });
  });
};
