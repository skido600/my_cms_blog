import { Hono } from "hono";
import {
  subscribe,
  verifySubscription,
  confirmSubscription,
  unsubscribe,
  confirmUnsubscribe,
} from "../controller/subscriber.controller";

const subscriberRoutes = new Hono();

subscriberRoutes.post("/", subscribe);

// Verify email address
subscriberRoutes.get("/verify", verifySubscription);

subscriberRoutes.post("/verify", confirmSubscription);

// Display unsubscribe confirmation page
subscriberRoutes.get("/unsubscribe", unsubscribe);

// Process unsubscribe confirmation
subscriberRoutes.post("/unsubscribe", confirmUnsubscribe);

export default subscriberRoutes;
