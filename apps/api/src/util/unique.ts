import type { Context } from "hono";
export const getClientIp = (c: Context) =>
  c.req.header("cf-connecting-ip") ||
  c.req.header("x-real-ip") ||
  c.req.header("x-forwarded-for")?.split(",")[0].trim() ||
  "unknown";

export const isBot = (ua: string) =>
  /bot|crawler|spider|crawling|preview|facebookexternalhit|whatsapp|telegram|slack|curl|wget|monitor|uptime|headless/i.test(
    ua,
  );
