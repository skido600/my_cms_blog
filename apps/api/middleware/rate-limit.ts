import type { Context, Next } from "hono";
import { redis } from "../src/util/redis";

const getClientIp = (c: Context) =>
  c.req.header("cf-connecting-ip") ||
  c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ||
  c.req.header("x-real-ip") ||
  "unknown";

export const rateLimiter = (
  windowMs: number,
  maxReq: number,
  scope = "global",
) => {
  return async (c: Context, next: Next) => {
    let limited = false;

    try {
      const redisKey = `rate:${scope}:${getClientIp(c)}`;
      const now = Date.now();

      const pipeline = redis.pipeline();
      pipeline.zadd(redisKey, {
        score: now,
        member: `${now}-${crypto.randomUUID()}`,
      });
      pipeline.zremrangebyscore(redisKey, 0, now - windowMs);
      pipeline.zcard(redisKey);
      pipeline.pexpire(redisKey, windowMs);

      const results = await pipeline.exec();
      limited = Number(results[2]) > maxReq;
    } catch (error) {
      // Fail open: don't take the API down if Redis is unavailable
      console.error("RATE LIMITER ERROR:", error);
    }

    if (limited) {
      c.header("Retry-After", String(Math.ceil(windowMs / 1000)));
      return c.json(
        {
          success: false,
          message: "Too many requests. Please try again later.",
        },
        429,
      );
    }

    await next();
  };
};
