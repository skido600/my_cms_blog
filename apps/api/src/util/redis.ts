import { Redis } from "@upstash/redis";
import { env } from "./env";

export const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

export const THREE_DAYS = 3 * 24 * 60 * 60;

export const POST_CACHE_KEYS = [
  "posts:all",
  "posts:featured",
  "posts:recent",
  "posts:categories",
] as const;

export async function invalidatePostCache() {
  try {
    await redis.del(...POST_CACHE_KEYS);
  } catch (error) {
    console.error("Redis cache invalidation failed:", error);
  }
}

export async function checkRedisConnection() {
  try {
    const result = await redis.ping();
    console.log("Redis connected successfully:", result);
  } catch (error) {
    console.error("Redis connection failed:", error);
  }
}

void checkRedisConnection();
