var stripe = require("stripe")(process.env.STRIPE);

export const updateCard = async (payload) => {
  var { stripeCustomerId, cardSourceId, expMonth, expYear, addressZip } =
    payload;

  return new Promise(async (resolve, reject) => {
    await stripe.customers
      .updateSource(stripeCustomerId, cardSourceId, {
        exp_month: expMonth,
        exp_year: expYear,
        address_zip: addressZip,
      })
      .then(async (stripeSources) => {
        resolve({ status: true, stripeSources: stripeSources });
      })
      .catch((error) => {
        reject({ status: false, message: error.message });
      });
  });
};
