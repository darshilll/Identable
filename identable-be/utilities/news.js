const NewsAPI = require("newsapi");
const newsapi = new NewsAPI("3e9f79c1b53945b88733e37552b97e41");

export const getNews = async (entry) => {
  let { seatchText, page = 1, pageSize = 12 } = entry;

  return new Promise(function (resolve, reject) {
    try {
      newsapi.v2
        .everything({
          q: seatchText,
          sortBy: "popularity",
          language: "en",
          page: page,
          pageSize: pageSize,
        })
        .then((response) => {
          resolve(response);
        });
    } catch (error) {
      console.error("getNews Error = ", error);
      resolve(null);
    }
  });
};
