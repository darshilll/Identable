let request = require("request");

const PEXELS_API_KEY =
  "nNJzg23bc2XksGZZkbBzyfBk1hLChrgfyuIfs4Cypcsk1cmCYWdvt9JC";

export const generatePexelImage = async (entry) => {
  let { searchText } = entry;

  return new Promise(function (resolve, reject) {
    const apiUrl = `https://api.pexels.com/v1/search?query=${searchText}&per_page=10&page=1`;

    let options = {
      method: "GET",
      url: apiUrl,
      headers: {
        Authorization: `${PEXELS_API_KEY}`,
      },
      json: true,
    };

    request(options, function (err, response, body) {
      try {
        if (err) {
          console.error("generatePexelImage Error = ", err);
        } else {
          if (response.statusCode == 200) {
            if (response?.body?.photos?.length > 0) {
              let imageData = response?.body?.photos;
              let imageArray = imageData?.map((obj) => obj?.src?.medium);
              if (imageArray?.length > 0) {
                resolve(imageArray);
                return;
              }
            }
          }
        }
      } catch (error) {
        console.error("generatePexelImage Error = ", error);
      }
      resolve(null);
    });
  });
};
