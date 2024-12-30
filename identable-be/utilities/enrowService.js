let request = require("request");

export const enrowFindSingleEmail = async (data) => {
  return new Promise(function (resolve, reject) {
    const options = {
      url: "https://api.enrow.io/email/find/single",
      method: "POST",
      headers: {
        "x-api-key": `be55758a-5856-41a8-a920-bdc32671401f`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    request(options, (error, response, body) => {
      try {
        if (error) {
          console.error("enrowFindSingleEmail = ", error);
        } else {
          if (response) {
            resolve(JSON.parse(response?.body));
            return;
          }
        }
      } catch (error) {
        console.error("enrowFindSingleEmail = ", error);
      }
      resolve(null);
    });
  });
};
