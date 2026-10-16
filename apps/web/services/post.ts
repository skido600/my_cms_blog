const API_URL = "/api/v1/admin";
export const createPost = async (form: FormData) => {
  const response = await fetch(`${API_URL}/create`, {
    method: "POST",
    credentials: "include",
    body: form,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const getAllPosts = async () => {
  const response = await fetch(API_URL, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch posts");
  }

  return data;
};

export const getPostBySlug = async (slug: string) => {
  const response = await fetch(`${API_URL}/${encodeURIComponent(slug)}`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch post");
  }

  return data;
};

export const updatePost = async (id: string, form: FormData) => {
  const response = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
    method: "PUT",
    credentials: "include",
    body: form,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update post");
  }

  return data;
};

export const deletePost = async (id: string) => {
  const response = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete post");
  }

  return data;
};

export const getAllFeaturedPosts = async () => {
  const response = await fetch(`${API_URL}/featured`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch post");
  }

  return data;
};
export const GetRecentPost = async () => {
  const response = await fetch(`${API_URL}/recent`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch post");
  }

  return data;
};
export const getAllCategories = async () => {
  const res = await fetch(`${API_URL}/categories`);

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  return res.json();
};

export const getPostsByCategory = async (category: string) => {
  const res = await fetch(
    `${API_URL}/category?category=${encodeURIComponent(category)}`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
};

import { cache } from "react";

export const getPostBySlugServer = cache(async (slug: string) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

    const res = await fetch(
      `${baseUrl}${API_URL}/${encodeURIComponent(slug)}`,
      {
        next: { revalidate: 60 },
      },
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? json;
  } catch (err) {
    console.error("getPostBySlugServer failed:", err);
    return null;
  }
});
