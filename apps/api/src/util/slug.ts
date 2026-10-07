import { eq } from "drizzle-orm";
db;
import { posts } from "../database/schema";
import { db } from "../database";

export const generateUniqueSlug = async (title: string) => {
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  let slug = baseSlug;
  let count = 1;

  while (true) {
    const [existingPost] = await db
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1);

    if (!existingPost) {
      return slug;
    }

    count++;
    slug = `${baseSlug}-${count}`;
  }
};
