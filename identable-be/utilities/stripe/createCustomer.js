var stripe = require("stripe")(process.env.STRIPE);

export const createCustomer = async (payload) => {
  return new Promise((resolve, reject) => {
    stripe.customers
      .create({
        email: payload.email,
        name: payload.firstName + " " + payload.lastName,
        source: payload.cardToken,
        description: "Software development services",
      })
      .then(async (customer) => {
        resolve({ status: true, customer });
      })
      .catch((error) => {
        resolve({ status: false, error });
      });
  });
};
