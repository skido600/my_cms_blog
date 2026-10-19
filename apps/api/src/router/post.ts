import { Hono } from "hono";

import {
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  getPostBySlug,
  getAllFeaturedPosts,
  getRecentPosts,
  getAllCategories,
  getPostsByCategory,
  registerView,
} from "../controller/post.controller";

import { requireAuth } from "../../middleware/verifyToken";
import { rateLimiter } from "../../middleware/rate-limit";

const postRequest = new Hono();

const readLimit = rateLimiter(60 * 1000, 120, "posts-read"); // 120/min
const writeLimit = rateLimiter(60 * 60 * 1000, 80, "posts-write"); // 80/hour

// Public
postRequest.use("*", async (c, next) =>
  c.req.method === "GET" ? readLimit(c, next) : next(),
);

postRequest.get("/", getAllPosts);
postRequest.get("/categories", getAllCategories);
postRequest.get("/category", getPostsByCategory);
postRequest.get("/featured", getAllFeaturedPosts);
postRequest.get("/recent", getRecentPosts);
postRequest.get("/:slug", getPostBySlug);
postRequest.post("/:slug/view", registerView);
// Admin
postRequest.post("/create", writeLimit, requireAuth, createPost);
postRequest.put("/:id", writeLimit, requireAuth, updatePost);
postRequest.delete("/:id", writeLimit, requireAuth, deletePost);

export default postRequest;
