var stripe = require("stripe")(process.env.STRIPE);

export const addCard = async (payload) => {
  var { stripeCustomerId, cardToken } = payload;

  return new Promise(async (resolve, reject) => {
    await stripe.customers
      .createSource(stripeCustomerId, { source: cardToken })
      .then(async (stripeSources) => {
        resolve({ status: true, stripeSources: stripeSources });
      })
      .catch((error) => {
        reject({ status: false, message: error.message });
      });
  });
};
