import { eq, desc } from "drizzle-orm";
import { db } from "../database";
import { posts } from "../database/schema";
import { createPostSchema } from "../validator/post.schema";
import type { Context } from "hono";
import { uploadImage } from "../util/uploadimage";
import { generateUniqueSlug } from "../util/slug";

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
        {
          success: false,
          message: "Invalid categories format",
        },
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
        {
          success: false,
          message: result.error.issues[0].message,
        },
        400,
      );
    }

    const { title, description, featured } = result.data;

    const user = c.get("userId");

    if (!user?.id) {
      return c.json(
        {
          success: false,
          message: "Unauthorized",
        },
        401,
      );
    }

    const image = body.headerImage;

    if (!(image instanceof File)) {
      return c.json(
        {
          success: false,
          message: "Header image is required",
        },
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
      })
      .returning();

    return c.json(
      {
        success: true,
        message: "Post created successfully",
        post,
      },
      201,
    );
  } catch (error) {
    console.error("Create post error:", error);

    return c.json(
      {
        success: false,
        message: "Server error",
      },
      500,
    );
  }
};

export const getPostBySlug = async (c: Context) => {
  try {
    const slug = c.req.param("slug");

    if (!slug) {
      return c.json(
        {
          success: false,
          message: "Slug is required",
        },
        400,
      );
    }

    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1);

    if (!post) {
      return c.json(
        {
          success: false,
          message: "Post not found",
        },
        404,
      );
    }

    // Get visitor IP
    const forwardedFor = c.req.header("x-forwarded-for");

    const ip =
      forwardedFor?.split(",")[0].trim() ||
      c.req.header("x-real-ip") ||
      "unknown";

    // Get browser/device information
    const userAgent = c.req.header("user-agent") || "unknown";

    // Current IPs that have viewed this post
    const viewedIPs = post.viewedIPs ?? [];

    // Check if this IP already viewed this post
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

    return c.json({
      success: true,
      post: {
        ...post,
        views: alreadyViewed ? post.views : post.views + 1,
      },
    });
  } catch (error) {
    console.error("Get post by slug error:", error);

    return c.json(
      {
        success: false,
        message: "Server error",
      },
      500,
    );
  }
};
export const getAllPosts = async (c: Context) => {
  try {
    const allPosts = await db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt));

    return c.json({
      success: true,
      posts: allPosts,
    });
  } catch (error) {
    console.error("Get all posts error:", error);

    return c.json(
      {
        success: false,
        message: "Server error",
      },
      500,
    );
  }
};

//  UPDATE POST

export const updatePost = async (c: Context) => {
  try {
    const postId = c.req.param("id");

    if (!postId) {
      return c.json(
        {
          success: false,
          message: "Post ID is required",
        },
        400,
      );
    }

    const body = await c.req.parseBody();

    /* -----------------------------
       Find existing post
    ----------------------------- */

    const [existingPost] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (!existingPost) {
      return c.json(
        {
          success: false,
          message: "Post not found",
        },
        404,
      );
    }

    /* -----------------------------
       Categories
    ----------------------------- */

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
        {
          success: false,
          message: "Invalid categories format",
        },
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

    /* -----------------------------
       Validate data
    ----------------------------- */

    const result = createPostSchema.safeParse({
      title: body.title,
      description: body.description,
      featured: body.featured === "true",
      categories,
    });

    if (!result.success) {
      return c.json(
        {
          success: false,
          message: result.error.issues[0].message,
        },
        400,
      );
    }

    const { title, description, featured } = result.data;

    /* -----------------------------
       Auth
    ----------------------------- */

    const user = c.get("userId");

    if (!user?.id) {
      return c.json(
        {
          success: false,
          message: "Unauthorized",
        },
        401,
      );
    }

    /* -----------------------------
       Generate new slug
    ----------------------------- */

    let slug = existingPost.slug;

    if (title !== existingPost.title) {
      slug = await generateUniqueSlug(title);
    }

    /* -----------------------------
       Prepare update
    ----------------------------- */

    const updateData: any = {
      title,
      slug,
      description,
      categories,
      featured,
    };

    /* -----------------------------
       Header image
       Only replace if a new file
       was actually uploaded
    ----------------------------- */

    const image = body.headerImage;

    if (image instanceof File) {
      const uploadedImage = await uploadImage(image);

      updateData.header_Image_UrL = uploadedImage.url;
      updateData.header_Image_public = uploadedImage.publicId;
    }

    /* -----------------------------
       Update database
    ----------------------------- */

    const [updatedPost] = await db
      .update(posts)
      .set(updateData)
      .where(eq(posts.id, postId))
      .returning();

    return c.json({
      success: true,
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Update post error:", error);

    return c.json(
      {
        success: false,
        message: "Server error",
      },
      500,
    );
  }
};

//  DELETE POST

export const deletePost = async (c: Context) => {
  try {
    const postId = c.req.param("id");

    if (!postId) {
      return c.json(
        {
          success: false,
          message: "Post ID is required",
        },
        400,
      );
    }

    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (!post) {
      return c.json(
        {
          success: false,
          message: "Post not found",
        },
        404,
      );
    }

    await db.delete(posts).where(eq(posts.id, postId));

    return c.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Delete post error:", error);

    return c.json(
      {
        success: false,
        message: "Server error",
      },
      500,
    );
  }
};
