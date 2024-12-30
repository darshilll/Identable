var stripe = require("stripe")(process.env.STRIPE);

export const deleteStripeCard = async (payload) => {
  var { stripeCustomerId, cardSourceId } = payload;

  return new Promise(async (resolve, reject) => {
    await stripe.customers
      .deleteSource(stripeCustomerId, cardSourceId)
      .then(async (stripeSources) => {
        resolve({ status: true, stripeSources: stripeSources });
      })
      .catch((error) => {
        reject({ status: false, message: error.message });
      });
  });
};
