import { eq, desc, arrayContains } from "drizzle-orm";
import { db } from "../database";
import { posts } from "../database/schema";
import { createPostSchema } from "../validator/post.schema";
import type { Context } from "hono";
import { uploadImage } from "../util/uploadimage";
import { generateUniqueSlug } from "../util/slug";
import { redis } from "../util/redis";
import { calculateReadTime } from "../util/read-time";
import { start } from "workflow/api";
import { newPostWorkflow } from "../../workflows/new-post";

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

    await redis.del(
      "posts:all",
      "posts:featured",
      "posts:recent",
      "posts:categories",
    );
    if (post) {
      await start(newPostWorkflow, [
        { title: post.title, excerpt: post.description, slug: post.slug },
      ]);
    }
    const { header_Image_public, ...postWithoutPublicId } = post;

    return c.json(
      {
        success: true,
        message: "Post created successfully",
        post: postWithoutPublicId,
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

    const forwardedFor = c.req.header("x-forwarded-for");

    const ip =
      forwardedFor?.split(",")[0].trim() ||
      c.req.header("x-real-ip") ||
      "unknown";

    const viewedIPs = post.viewedIPs ?? [];
    const alreadyViewed = viewedIPs.includes(ip);

    if (!alreadyViewed && ip !== "unknown") {
      const updatedIPs = [...viewedIPs, ip];

      await db
        .update(posts)
        .set({
          views: post.views + 1,
          viewedIPs: updatedIPs,
        })
        .where(eq(posts.id, post.id));
    }

    const { header_Image_public, ...postWithoutPublicId } = post;

    return c.json({
      success: true,
      post: {
        ...postWithoutPublicId,
        views: alreadyViewed ? post.views : post.views + 1,
      },
    });
  } catch (error) {
    console.error("Get post by slug error:", error);

    return c.json({ success: false, message: "Server error" }, 500);
  }
};

export const getAllPosts = async (c: Context) => {
  try {
    const cacheKey = "posts:all";
    const cachedPosts = await redis.get(cacheKey);

    if (cachedPosts) {
      const postsWithoutPublicId = JSON.parse(cachedPosts).map(
        ({ header_Image_public, ...post }: any) => post,
      );

      return c.json({
        success: true,
        source: "redis",
        posts: postsWithoutPublicId,
      });
    }

    const allPosts = await db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt));

    const postsWithoutPublicId = allPosts.map(
      ({ header_Image_public, ...post }) => post,
    );

    const THREE_DAYS = 3 * 24 * 60 * 60;

    await redis.set(
      cacheKey,
      JSON.stringify(postsWithoutPublicId),
      "EX",
      THREE_DAYS,
    );

    return c.json({
      success: true,
      source: "postgres",
      posts: postsWithoutPublicId,
    });
  } catch (error) {
    console.error("Get all posts error:", error);

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

    let slug = existingPost.slug;

    if (title !== existingPost.title) {
      slug = await generateUniqueSlug(title);
    }

    const updateData: any = {
      title,
      slug,
      description,
      categories,
      featured,
      readTime: calculateReadTime(description),
    };

    const image = body.headerImage;

    if (image instanceof File) {
      const uploadedImage = await uploadImage(image);

      updateData.header_Image_UrL = uploadedImage.url;
      updateData.header_Image_public = uploadedImage.publicId;
    }

    const [updatedPost] = await db
      .update(posts)
      .set(updateData)
      .where(eq(posts.id, postId))
      .returning();

    await redis.del(
      "posts:all",
      "posts:featured",
      "posts:recent",
      "posts:categories",
    );

    const { header_Image_public, ...postWithoutPublicId } = updatedPost;

    return c.json({
      success: true,
      message: "Post updated successfully",
      post: postWithoutPublicId,
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
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (!post) {
      return c.json({ success: false, message: "Post not found" }, 404);
    }

    await db.delete(posts).where(eq(posts.id, postId));

    await redis.del(
      "posts:all",
      "posts:featured",
      "posts:recent",
      "posts:categories",
    );

    return c.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Delete post error:", error);

    return c.json({ success: false, message: "Server error" }, 500);
  }
};

export const getAllFeaturedPosts = async (c: Context) => {
  try {
    const cacheKey = "posts:featured";
    const cachedPosts = await redis.get(cacheKey);

    if (cachedPosts) {
      const featuredPosts = JSON.parse(cachedPosts).map(
        ({ header_Image_public, ...post }: any) => post,
      );

      return c.json({
        success: true,
        source: "redis",
        total: featuredPosts.length,
        posts: featuredPosts,
      });
    }

    const featuredPosts = await db
      .select()
      .from(posts)
      .where(eq(posts.featured, true))
      .orderBy(desc(posts.createdAt));

    const postsWithoutPublicId = featuredPosts.map(
      ({ header_Image_public, ...post }) => post,
    );

    const THREE_DAYS = 3 * 24 * 60 * 60;

    await redis.set(
      cacheKey,
      JSON.stringify(postsWithoutPublicId),
      "EX",
      THREE_DAYS,
    );

    return c.json({
      success: true,
      source: "postgres",
      total: postsWithoutPublicId.length,
      posts: postsWithoutPublicId,
    });
  } catch (error) {
    console.error("Get featured posts error:", error);

    return c.json({ success: false, message: "Server error" }, 500);
  }
};

export const getRecentPosts = async (c: Context) => {
  try {
    const cacheKey = "posts:recent";
    const cachedPosts = await redis.get(cacheKey);

    if (cachedPosts) {
      const recentPosts = JSON.parse(cachedPosts).map(
        ({ header_Image_public, ...post }: any) => post,
      );

      return c.json({
        success: true,
        source: "redis",
        total: recentPosts.length,
        posts: recentPosts,
      });
    }

    const recentPosts = await db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt))
      .limit(6);

    const postsWithoutPublicId = recentPosts.map(
      ({ header_Image_public, ...post }) => post,
    );

    const THREE_DAYS = 3 * 24 * 60 * 60;

    await redis.set(
      cacheKey,
      JSON.stringify(postsWithoutPublicId),
      "EX",
      THREE_DAYS,
    );

    return c.json({
      success: true,
      source: "postgres",
      total: postsWithoutPublicId.length,
      posts: postsWithoutPublicId,
    });
  } catch (error) {
    console.error("Get recent posts error:", error);

    return c.json({ success: false, message: "Server error" }, 500);
  }
};

export const getAllCategories = async (c: Context) => {
  try {
    const cacheKey = "posts:categories";
    const cachedCategories = await redis.get(cacheKey);

    if (cachedCategories) {
      return c.json({
        success: true,
        source: "redis",
        categories: JSON.parse(cachedCategories),
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

    const THREE_DAYS = 3 * 24 * 60 * 60;

    await redis.set(cacheKey, JSON.stringify(categories), "EX", THREE_DAYS);

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

    const postsWithoutPublicId = result.map(
      ({ header_Image_public, ...post }) => post,
    );

    return c.json({
      success: true,
      posts: postsWithoutPublicId,
    });
  } catch (error) {
    console.error("Get posts by category error:", error);

    return c.json({ success: false, message: "Server error" }, 500);
  }
};
