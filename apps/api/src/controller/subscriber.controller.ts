import { createHash, randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import type { Context } from "hono";

import { db } from "../database";
import { subscribers } from "../database/schema";

import {
  subscriber as subscriberTemplate,
  unsubscribePage,
} from "../util/subscriber-templates";
import SMTPservice, { escapeHtml } from "../util/email";
import { env } from "../util/env";
import { emailSchema } from "../validator/email";

const API_URL = env.API_URL;
const WEB_URL = env.WEB_URL;

const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

const isValidToken = (token: string) => /^[a-f0-9]{64}$/i.test(token);

const htmlPage = (title: string, message: string) =>
  new Response(
    `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${escapeHtml(title)}</title>
      </head>
      <body style="margin:0;padding:40px 16px;background:#f4f4f5;font-family:Arial,sans-serif;color:#18181b">
        <main style="max-width:480px;margin:40px auto;background:white;padding:32px;border:1px solid #e4e4e7;border-radius:16px">
          <h1>${escapeHtml(title)}</h1>
          <p style="line-height:1.8;color:#52525b">${escapeHtml(message)}</p>
        </main>
      </body>
    </html>`,
    {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    },
  );

export const subscribe = async (c: Context) => {
  try {
    if (!API_URL) {
      return c.json(
        { success: false, message: "API_URL is not configured." },
        500,
      );
    }

    const body = await c.req.json<{ email?: string }>();
    const email = body.email?.trim().toLowerCase();

    const result = emailSchema.safeParse(email);

    if (!result.success) {
      return c.json(
        {
          success: false,
          message: "Please provide a valid email address.",
        },
        400,
      );
    }

    const validatedEmail = result.data;
    const [existing] = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.email, validatedEmail))
      .limit(1);

    if (existing?.isVerified && existing.isActive) {
      return c.json({
        success: true,
        message: "This email is already subscribed.",
      });
    }
   if (
     existing &&
     !existing.isVerified &&
     existing.verificationTokenHash &&
     existing.verificationTokenExpiresAt &&
     existing.verificationTokenExpiresAt.getTime() > Date.now()
   ) {
     return c.json({
       success: true,
       message:
         "A verification email has already been sent. Please check your inbox.",
     });
   }
    const token = randomBytes(32).toString("hex");
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    if (existing) {
      await db
        .update(subscribers)
        .set({
          verificationTokenHash: tokenHash,
          verificationTokenExpiresAt: expiresAt,
        })
        .where(eq(subscribers.id, existing.id));
    } else {
      await db.insert(subscribers).values({
        email: validatedEmail,
        isVerified: false,
        isActive: false,
        verificationTokenHash: tokenHash,
        verificationTokenExpiresAt: expiresAt,
        unsubscribeToken: randomBytes(32).toString("hex"),
      });
    }

    const verificationUrl = `${API_URL}/api/v1/subscribe/verify?token=${token}`;

    await SMTPservice.sendEmail({
      to: validatedEmail,
      subject: "Confirm your blog subscription",
      text: [
        "Thanks for subscribing!",
        "",
        "Open this link to confirm your email address:",
        verificationUrl,
        "",
        "This link expires in 24 hours.",
        "If you didn't request this, ignore this email.",
      ].join("\n"),
      html: subscriberTemplate(verificationUrl),
    });

    return c.json({
      success: true,
      message: "Check your inbox for a verification link.",
    });
  } catch (error) {
    console.error("Subscribe controller error:", error);

    return c.json(
      {
        success: false,
        message: "Unable to process your subscription. Please try again.",
      },
      500,
    );
  }
};

export const verifySubscription = async (c: Context) => {
  const token = c.req.query("token");

  if (!WEB_URL || !token || !isValidToken(token)) {
    return htmlPage(
      "Invalid verification link",
      "This verification link is invalid.",
    );
  }

  return c.redirect(`${WEB_URL}/verify?verify=${token}`, 302);
};

export const confirmSubscription = async (c: Context) => {
  try {
    const body = await c.req.json<{ token?: string }>().catch(() => ({}));
    const token = (body as { token?: string }).token;

    if (typeof token !== "string" || !isValidToken(token)) {
      return c.json(
        { success: false, message: "Invalid verification link." },
        400,
      );
    }

    const tokenHash = hashToken(token);

    const [record] = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.verificationTokenHash, tokenHash))
      .limit(1);

    if (!record) {
      return c.json(
        {
          success: false,
          message: "This link is invalid or has already been used.",
        },
        400,
      );
    }

    if (
      !record.verificationTokenExpiresAt ||
      record.verificationTokenExpiresAt.getTime() < Date.now()
    ) {
      return c.json(
        {
          success: false,
          message: "This link has expired. Please subscribe again.",
        },
        400,
      );
    }

    await db
      .update(subscribers)
      .set({
        isVerified: true,
        isActive: true,
        verificationTokenHash: null,
        verificationTokenExpiresAt: null,
      })
      .where(eq(subscribers.id, record.id));

    return c.json({ success: true, message: "Subscription confirmed." });
  } catch (error) {
    console.error("Confirm subscription error:", error);
    return c.json(
      { success: false, message: "Something went wrong. Please try again." },
      500,
    );
  }
};

export const unsubscribe = async (c: Context) => {
  const token = c.req.query("token");

  if (!WEB_URL || !token || !isValidToken(token)) {
    return htmlPage(
      "Invalid verification link",
      "This verification link is invalid.",
    );
  }
  return c.redirect(`${WEB_URL}/unsubscribe?token=${token}`, 302);
};

export const confirmUnsubscribe = async (c: Context) => {
  try {
    const body = await c.req.json<{ token?: string }>().catch(() => ({}));
    const token = (body as { token?: string }).token;

    if (typeof token !== "string" || !isValidToken(token)) {
      return c.json(
        { success: false, message: "This unsubscribe link is invalid." },
        400,
      );
    }

    const [record] = await db
      .select({ id: subscribers.id })
      .from(subscribers)
      .where(eq(subscribers.unsubscribeToken, token))
      .limit(1);

    if (!record) {
      return c.json(
        { success: false, message: "This unsubscribe link is invalid." },
        400,
      );
    }

    await db
      .update(subscribers)
      .set({ isActive: false })
      .where(eq(subscribers.id, record.id));

    return c.json({ success: true, message: "You have been unsubscribed." });
  } catch (error) {
    console.error("Confirm unsubscribe error:", error);
    return c.json(
      { success: false, message: "Something went wrong. Please try again." },
      500,
    );
  }
};
