import { Hono } from "hono";
import { logout, login } from "../controller/auth.controller";

const authRoutes = new Hono();

authRoutes.post("/login", login);
authRoutes.post("/logout", logout);

export default authRoutes;
