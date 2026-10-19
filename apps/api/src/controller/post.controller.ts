import { eq, desc, arrayContains, sql } from "drizzle-orm";
import { db } from "../database";
import { posts } from "../database/schema";
import { createPostSchema } from "../validator/post.schema";
import type { Context } from "hono";
import { uploadImage } from "../util/uploadimage";
import { generateUniqueSlug } from "../util/slug";
import { redis, THREE_DAYS, invalidatePostCache } from "../util/redis";
import { calculateReadTime } from "../util/read-time";
import { start } from "workflow/api";
import { newPostWorkflow } from "../../workflows/new-post";
import { getClientIp, isBot } from "../util/unique";

const removePublicId = (post: any) => {
  const { header_Image_public, ...safePost } = post;
  return safePost;
};

export const createPost = async (c: Context) => {
  try {
    const body = await c.req.parseBody();

    let categories: string[] = [];

    try {
      if (body.categories) {
        categories =
          typeof body.categories === "string"
            ? JSON.parse(body.categories)
            : [];
      }
    } catch {
      return c.json(
        { success: false, message: "Invalid categories format" },
        400,
      );
    }

    if (
      !Array.isArray(categories) ||
      !categories.every((category) => typeof category === "string")
    ) {
      return c.json(
        {
          success: false,
          message: "Categories must be an array of strings",
        },
        400,
      );
    }

    const result = createPostSchema.safeParse({
      title: body.title,
      description: body.description,
      featured: body.featured === "true",
      categories,
    });

    if (!result.success) {
      return c.json(
        { success: false, message: result.error.issues[0].message },
        400,
      );
    }

    const { title, description, featured } = result.data;
    const user = c.get("userId");

    if (!user?.id) {
      return c.json({ success: false, message: "Unauthorized" }, 401);
    }

    const image = body.headerImage;

    if (!(image instanceof File)) {
      return c.json(
        { success: false, message: "Header image is required" },
        400,
      );
    }

    const slug = await generateUniqueSlug(title);
    const uploadedImage = await uploadImage(image);

    const [post] = await db
      .insert(posts)
      .values({
        title,
        slug,
        description,
        categories,
        userId: user.id,
        header_Image_UrL: uploadedImage.url,
        header_Image_public: uploadedImage.publicId,
        featured,
        readTime: calculateReadTime(description),
      })
      .returning();

    if (!post) {
      return c.json({ success: false, message: "Failed to create post" }, 500);
    }

    await invalidatePostCache();

    try {
      await start(newPostWorkflow, [
        {
          title: post.title,
          excerpt: post.description,
          slug: post.slug,
        },
      ]);
    } catch (error) {
      console.error("New post workflow error:", error);
    }

    return c.json(
      {
        success: true,
        message: "Post created successfully",
        post: removePublicId(post),
      },
      201,
    );
  } catch (error) {
    console.error("Create post error:", error);
    return c.json({ success: false, message: "Server error" }, 500);
  }
};

export const getPostBySlug = async (c: Context) => {
  try {
    const slug = c.req.param("slug");
    if (!slug) {
      return c.json({ success: false, message: "Slug is required" }, 400);
    }

    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1);

    if (!post) {
      return c.json({ success: false, message: "Post not found" }, 404);
    }

    return c.json({ success: true, post: removePublicId(post) });
  } catch (error) {
    console.error("Get post by slug error:", error);
    return c.json({ success: false, message: "Server error" }, 500);
  }
};
export const registerView = async (c: Context) => {
  try {
    const slug = c.req.param("slug");
    if (!slug) {
      return c.json(
        { success: false, reason: "missing_slug", message: "Slug is required" },
        400,
      );
    }

    const userAgent = c.req.header("user-agent") ?? "";
    if (isBot(userAgent)) {
      return c.json({ success: true, counted: false, reason: "bot" });
    }

    const ip = getClientIp(c);
    if (ip === "unknown") {
      console.warn("registerView: could not determine client IP");
      return c.json({ success: true, counted: false, reason: "no_ip" });
    }

    const [updated] = await db
      .update(posts)
      .set({
        views: sql`${posts.views} + 1`,
        viewedIPs: sql`array_append(COALESCE(${posts.viewedIPs}, '{}'), ${ip})`,
      })
      .where(
        sql`${posts.slug} = ${slug}
            AND NOT (${ip} = ANY(COALESCE(${posts.viewedIPs}, '{}')))`,
      )
      .returning({ views: posts.views });

    if (updated) {
      return c.json({
        success: true,
        counted: true,
        reason: "new_view",
        views: updated.views,
      });
    }

    // Nothing updated: post doesn't exist, or this IP was already counted
    const [existing] = await db
      .select({ views: posts.views })
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1);

    if (!existing) {
      return c.json(
        { success: false, reason: "post_not_found", message: "Post not found" },
        404,
      );
    }

    return c.json({
      success: true,
      counted: false,
      reason: "already_counted",
      views: existing.views,
    });
  } catch (error) {
    console.error("Register view error:", error);
    return c.json({ success: false, message: "Server error" }, 500);
  }
};

export const getAllPosts = async (c: Context) => {
  try {
    const cacheKey = "posts:all";
    const cachedPosts = await redis.get<any[]>(cacheKey);

    if (cachedPosts !== null) {
      return c.json({
        success: true,
        source: "redis",
        posts: cachedPosts,
      });
    }

    const allPosts = await db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt));

    const safePosts = allPosts.map(removePublicId);

    await redis.set(cacheKey, safePosts, { ex: THREE_DAYS });

    return c.json({
      success: true,
      source: "postgres",
      posts: safePosts,
    });
  } catch (error) {
    console.error("Get all posts error:", error);
    return c.json({ success: false, message: "Server error" }, 500);
  }
};

// GET FEATURED POSTS
export const getAllFeaturedPosts = async (c: Context) => {
  try {
    const cacheKey = "posts:featured";
    const cachedPosts = await redis.get<any[]>(cacheKey);

    if (cachedPosts !== null) {
      return c.json({
        success: true,
        source: "redis",
        total: cachedPosts.length,
        posts: cachedPosts,
      });
    }

    const featuredPosts = await db
      .select()
      .from(posts)
      .where(eq(posts.featured, true))
      .orderBy(desc(posts.createdAt));

    const safePosts = featuredPosts.map(removePublicId);

    await redis.set(cacheKey, safePosts, { ex: THREE_DAYS });

    return c.json({
      success: true,
      source: "postgres",
      total: safePosts.length,
      posts: safePosts,
    });
  } catch (error) {
    console.error("Get featured posts error:", error);
    return c.json({ success: false, message: "Server error" }, 500);
  }
};

// GET RECENT POSTS
export const getRecentPosts = async (c: Context) => {
  try {
    const cacheKey = "posts:recent";
    const cachedPosts = await redis.get<any[]>(cacheKey);

    if (cachedPosts !== null) {
      return c.json({
        success: true,
        source: "redis",
        total: cachedPosts.length,
        posts: cachedPosts,
      });
    }

    const recentPosts = await db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt))
      .limit(6);

    const safePosts = recentPosts.map(removePublicId);

    await redis.set(cacheKey, safePosts, { ex: THREE_DAYS });

    return c.json({
      success: true,
      source: "postgres",
      total: safePosts.length,
      posts: safePosts,
    });
  } catch (error) {
    console.error("Get recent posts error:", error);
    return c.json({ success: false, message: "Server error" }, 500);
  }
};

// GET ALL CATEGORIES
export const getAllCategories = async (c: Context) => {
  try {
    const cacheKey = "posts:categories";
    const cachedCategories = await redis.get<string[]>(cacheKey);

    if (cachedCategories !== null) {
      return c.json({
        success: true,
        source: "redis",
        categories: cachedCategories,
      });
    }

    const allPosts = await db
      .select({
        categories: posts.categories,
      })
      .from(posts);

    const categories = [
      ...new Set(allPosts.flatMap((post) => post.categories ?? [])),
    ].sort((a, b) => a.localeCompare(b));

    await redis.set(cacheKey, categories, { ex: THREE_DAYS });

    return c.json({
      success: true,
      source: "postgres",
      categories,
    });
  } catch (error) {
    console.error("Get all categories error:", error);
    return c.json({ success: false, message: "Server error" }, 500);
  }
};

// GET POSTS BY CATEGORY
export const getPostsByCategory = async (c: Context) => {
  try {
    const category = c.req.query("category");

    if (!category) {
      return c.json({ success: false, message: "Category is required" }, 400);
    }

    const result = await db
      .select()
      .from(posts)
      .where(arrayContains(posts.categories, [category]))
      .orderBy(desc(posts.createdAt));

    return c.json({
      success: true,
      posts: result.map(removePublicId),
    });
  } catch (error) {
    console.error("Get posts by category error:", error);
    return c.json({ success: false, message: "Server error" }, 500);
  }
};

// UPDATE POST
export const updatePost = async (c: Context) => {
  try {
    const postId = c.req.param("id");

    if (!postId) {
      return c.json({ success: false, message: "Post ID is required" }, 400);
    }

    const body = await c.req.parseBody();

    const [existingPost] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (!existingPost) {
      return c.json({ success: false, message: "Post not found" }, 404);
    }

    const user = c.get("userId");

    if (!user?.id) {
      return c.json({ success: false, message: "Unauthorized" }, 401);
    }

    let categories: string[] = [];

    try {
      if (body.categories) {
        categories =
          typeof body.categories === "string"
            ? JSON.parse(body.categories)
            : [];
      }
    } catch {
      return c.json(
        { success: false, message: "Invalid categories format" },
        400,
      );
    }

    if (
      !Array.isArray(categories) ||
      !categories.every((category) => typeof category === "string")
    ) {
      return c.json(
        {
          success: false,
          message: "Categories must be an array of strings",
        },
        400,
      );
    }

    const result = createPostSchema.safeParse({
      title: body.title,
      description: body.description,
      featured: body.featured === "true",
      categories,
    });

    if (!result.success) {
      return c.json(
        { success: false, message: result.error.issues[0].message },
        400,
      );
    }

    const { title, description, featured } = result.data;

    let slug = existingPost.slug;

    if (title !== existingPost.title) {
      slug = await generateUniqueSlug(title);
    }

    const updateData: Record<string, unknown> = {
      title,
      slug,
      description,
      categories,
      featured,
      readTime: calculateReadTime(description),
    };

    const image = body.headerImage;

    if (image instanceof File && image.size > 0) {
      const uploadedImage = await uploadImage(image);

      updateData.header_Image_UrL = uploadedImage.url;
      updateData.header_Image_public = uploadedImage.publicId;
    }

    const [updatedPost] = await db
      .update(posts)
      .set(updateData as typeof posts.$inferInsert)
      .where(eq(posts.id, postId))
      .returning();

    if (!updatedPost) {
      return c.json({ success: false, message: "Failed to update post" }, 500);
    }

    await invalidatePostCache();

    return c.json({
      success: true,
      message: "Post updated successfully",
      post: removePublicId(updatedPost),
    });
  } catch (error) {
    console.error("Update post error:", error);
    return c.json({ success: false, message: "Server error" }, 500);
  }
};

// DELETE POST
export const deletePost = async (c: Context) => {
  try {
    const postId = c.req.param("id");

    if (!postId) {
      return c.json({ success: false, message: "Post ID is required" }, 400);
    }

    const [post] = await db
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (!post) {
      return c.json({ success: false, message: "Post not found" }, 404);
    }

    await db.delete(posts).where(eq(posts.id, postId));

    await invalidatePostCache();

    return c.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Delete post error:", error);
    return c.json({ success: false, message: "Server error" }, 500);
  }
};
