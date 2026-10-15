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
} from "../controller/post.controller";

import { requireAuth } from "../../middleware/verifyToken";

const postRequest = new Hono();

// Public
postRequest.get("/", getAllPosts);
postRequest.get("/categories", getAllCategories);
postRequest.get("/category", getPostsByCategory);
postRequest.get("/featured", getAllFeaturedPosts);
postRequest.get("/recent", getRecentPosts);
postRequest.get("/:slug", getPostBySlug);
// Admin
postRequest.post("/create", requireAuth, createPost);
postRequest.put("/:id", requireAuth, updatePost);
postRequest.delete("/:id", requireAuth, deletePost);

export default postRequest;
