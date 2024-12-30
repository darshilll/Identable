var stripe = require("stripe")(process.env.STRIPE);

export const getCardList = async (payload) => {
  var { stripeCustomerId } = payload;

  return new Promise(async (resolve, reject) => {
    await stripe.customers
      .listSources(stripeCustomerId, { object: "card" })
      .then(async (stripeSources) => {
        if (stripeSources.data) {
          resolve({ status: true, stripeSources: stripeSources.data });
        } else {
          reject({ status: false, message: "card not found" });
        }
      })
      .catch((error) => {
        reject({ status: false, message: "Please add payment information" });
      });
  });
};
