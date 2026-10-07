import type { Context, Next } from "hono";
import { verify, sign } from "hono/jwt";
import { and, eq } from "drizzle-orm";

import {
  FIFTEEN_MINUTES_SECONDS,
  setAuthCookies,
  clearAuthCookies,
  getAuthCookies,
} from "../src/util/cookies";

import { sessions, users } from "../src/database/schema";
import { db } from "../src/database";
import { env } from "../src/util/env";

export async function requireAuth(c: Context, next: Next) {
  try {
    const { accessToken, refreshToken } = await getAuthCookies(c);

    console.log("AUTH DEBUG");
    console.log("accessToken exists:", !!accessToken);
    console.log("refreshToken exists:", !!refreshToken);

    // ==========================================
    // 1. TRY ACCESS TOKEN
    // ==========================================

    if (accessToken) {
      try {
        const payload = await verify(
          accessToken,
          env.JWT_ACCESS_SECRET,
          "HS256",
        );

        const userId = payload.id as string;

        console.log("ACCESS TOKEN USER ID:", userId);

        if (!userId || !refreshToken) {
          clearAuthCookies(c);

          return c.json(
            {
              success: false,
              message: "Authentication required",
            },
            401,
          );
        }

        // Check that the refresh session still exists
        const [session] = await db
          .select()
          .from(sessions)
          .where(
            and(
              eq(sessions.refreshToken, refreshToken),
              eq(sessions.userId, userId),
            ),
          )
          .limit(1);

        if (!session) {
          console.log("Session not found");

          clearAuthCookies(c);

          return c.json(
            {
              success: false,
              message: "Session expired. Please login again.",
            },
            401,
          );
        }

        // Check database session expiration
        if (session.expiresAt <= new Date()) {
          console.log("Session expired");

          await db
            .delete(sessions)
            .where(eq(sessions.refreshToken, refreshToken));

          clearAuthCookies(c);

          return c.json(
            {
              success: false,
              message: "Session expired. Please login again.",
            },
            401,
          );
        }

        // Authenticated
        c.set("userId", {
          id: userId,
        });

        return next();
      } catch (error) {
        console.log("Access token invalid/expired:", error);

        // Don't immediately return.
        // Try refresh token below.
      }
    }

    // ==========================================
    // 2. REFRESH TOKEN
    // ==========================================

    if (!refreshToken) {
      console.log("No refresh token");

      clearAuthCookies(c);

      return c.json(
        {
          success: false,
          message: "Authentication required",
        },
        401,
      );
    }

    let refreshPayload;

    try {
      refreshPayload = await verify(
        refreshToken,
        env.JWT_REFRESH_SECRET,
        "HS256",
      );
    } catch (error) {
      console.log("Refresh token invalid/expired:", error);

      clearAuthCookies(c);

      return c.json(
        {
          success: false,
          message: "Session expired. Please login again.",
        },
        401,
      );
    }

    const userId = refreshPayload.id as string;

    if (!userId) {
      clearAuthCookies(c);

      return c.json(
        {
          success: false,
          message: "Invalid session",
        },
        401,
      );
    }

    // ==========================================
    // 3. CHECK REFRESH SESSION
    // ==========================================

    const [session] = await db
      .select()
      .from(sessions)
      .where(
        and(
          eq(sessions.refreshToken, refreshToken),
          eq(sessions.userId, userId),
        ),
      )
      .limit(1);

    if (!session) {
      console.log("Refresh session not found");

      clearAuthCookies(c);

      return c.json(
        {
          success: false,
          message: "Session expired. Please login again.",
        },
        401,
      );
    }

    if (session.expiresAt <= new Date()) {
      console.log("Refresh session expired");

      await db.delete(sessions).where(eq(sessions.refreshToken, refreshToken));

      clearAuthCookies(c);

      return c.json(
        {
          success: false,
          message: "Session expired. Please login again.",
        },
        401,
      );
    }

    // ==========================================
    // 4. CHECK USER
    // ==========================================

    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      await db.delete(sessions).where(eq(sessions.refreshToken, refreshToken));

      clearAuthCookies(c);

      return c.json(
        {
          success: false,
          message: "User not found",
        },
        401,
      );
    }

    // ==========================================
    // 5. CREATE NEW ACCESS TOKEN
    // ==========================================

    const newAccessToken = await sign(
      {
        id: user.id,
        exp: Math.floor(Date.now() / 1000) + FIFTEEN_MINUTES_SECONDS,
      },
      env.JWT_ACCESS_SECRET,
    );

    // Replace access cookie.
    // Keep existing refresh token.
    await setAuthCookies(c, newAccessToken, refreshToken);

    c.set("userId", {
      id: user.id,
    });

    return next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    clearAuthCookies(c);

    return c.json(
      {
        success: false,
        message: "Authentication failed",
      },
      401,
    );
  }
}
