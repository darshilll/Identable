let request = require("request");

export const seoContentOptimization = async (entry) => {
  let { title, metaDescription, bodyContent, keywords } = entry;

  return new Promise(function (resolve, reject) {
    let data = {
      content_input: {
        title_tag: title,
        meta_description: metaDescription,
        body_content: bodyContent,
      },
    };

    const options = {
      url: `https://api.seoreviewtools.com/v5-1/seo-content-optimization/?content=1&keyword=${keywords}&key=349578934-34503405993422`,
      method: "POST",
      headers: {
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
