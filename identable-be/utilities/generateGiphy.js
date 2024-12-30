let request = require("request");

const apiKey = "2QFunLMVF9Dt1CnGTZQltBeCzwsIrnlJ";

export const generateGiphy = async (entry) => {
  let { searchText } = entry;

  return new Promise(function (resolve, reject) {
    const apiUrl = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${searchText}&limit=5&offset=0&rating=G&lang=en`;

    let options = {
      method: "GET",
      url: apiUrl,
      json: true,
    };

    request(options, function (err, response, body) {
      try {
        if (err) {
          console.error("generateGiphy Error = ", err);
        } else {
          if (response.statusCode == 200) {
            if (response?.body?.data?.length > 0) {
              let gifData = response?.body?.data;
              let imageArray = gifData?.map(
                (gif) => gif?.images?.fixed_height?.url
              );
              if (imageArray?.length > 0) {
                resolve(imageArray);
                return;
              }
            }
          }
        }
      } catch (error) {
        console.error("generateGiphy Error = ", error);
      }
      resolve(null);
    });
  });
};
