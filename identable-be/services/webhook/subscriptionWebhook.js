import { checkoutSessionCompletedEvent } from "./subscription/checkoutSessionCompletedEvent";
import { subscriptionUpdateEvent } from "./subscription/subscriptionUpdateEvent";
import { subscriptionDeleteEvent } from "./subscription/subscriptionDeleteEvent";
import { invoicePaidEvent } from "./subscription/invoicePaidEvent";

export const subscriptionWebhook = async (entry) => {
  const event = entry?.body;

  switch (event?.type) {
    case "checkout.session.completed":
      await checkoutSessionCompletedEvent(event);
      break;
    case "customer.subscription.updated":
      await subscriptionUpdateEvent(event);
      break;
    case "customer.subscription.deleted":
      await subscriptionDeleteEvent(event);
      break;
    case "invoice.paid":
      await invoicePaidEvent(event);
      break;
    default:
      break;
  }
  return "Success";
};
