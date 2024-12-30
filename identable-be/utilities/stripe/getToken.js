var stripe = require("stripe")(process.env.STRIPE);

export const getToken = async (payload) => {
  var { cardToken } = payload;

  return new Promise(async (resolve, reject) => {
    await stripe.tokens
      .retrieve(cardToken)
      .then(async (stripeSources) => {
        if (stripeSources) {
          resolve({ status: true, stripeSources: stripeSources });
        } else {
          reject({ status: false, message: "Please add payment information" });
        }
      })
      .catch((error) => {
        reject({ status: false, message: "Please add payment information" });
      });
  });
};
