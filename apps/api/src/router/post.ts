import { Hono } from "hono";

import {
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  getPostBySlug,
} from "../controller/post.controller";

import { requireAuth } from "../../middleware/verifyToken";

const postRequest = new Hono();

// Public
postRequest.get("/", getAllPosts);
postRequest.get("/:slug", getPostBySlug);

// Admin
postRequest.post("/create", requireAuth, createPost);
postRequest.put("/:id", requireAuth, updatePost);
postRequest.delete("/:id", requireAuth, deletePost);

export default postRequest;
