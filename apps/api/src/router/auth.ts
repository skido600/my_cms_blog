import { Hono } from "hono";
import { logout, login } from "../controller/auth.controller";
import { rateLimiter } from "../../middleware/rate-limit";

const authRoutes = new Hono();

authRoutes.post("/login", rateLimiter(60 * 60 * 1000, 80), login);
authRoutes.post("/logout", logout);

export default authRoutes;
