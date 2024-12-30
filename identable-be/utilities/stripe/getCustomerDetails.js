var stripe = require("stripe")(process.env.STRIPE);

export const getCustomerDetails = async (payload) => {
  var { stripeCustomerId } = payload;

  return new Promise(async (resolve, reject) => {
    await stripe.customers
      .retrieve(stripeCustomerId)
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
