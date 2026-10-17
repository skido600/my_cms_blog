import { Hono } from "hono";
import { logger } from "hono/logger";
import authRoutes from "./router/auth";
import postRequest from "./router/post";
import subscriberRoutes from "./router/subscriber.routes";
import { start } from "workflow/api";
import { monthlyReminderWorkflow } from "../workflows/monthly-reminder";
import { env } from "./util/env";
import { rateLimiter } from "../middleware/rate-limit";

const app = new Hono();
app.use(logger());

app.notFound((c) => {
  return c.json({ message: "url Not Found" }, 404);
});

app.onError((err, c) => {
  return c.json(
    {
      success: false,
      message: err.message || "Internal server error",
      data: null,
    },
    500,
  );
});
const v1 = new Hono().basePath("/api/v1");
v1.get("/", (c) => {
  return c.json({
    success: true,
    message: "API v1 working",
  });
});
v1.route("/auth", authRoutes);
v1.route("/admin", postRequest);
v1.route("/subscribe", subscriberRoutes);
app.route("/", v1);

const run = await start(monthlyReminderWorkflow, []);
console.log("Run started:", run.runId);
export default app;
