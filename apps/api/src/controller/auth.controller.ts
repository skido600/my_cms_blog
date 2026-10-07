import { eq } from "drizzle-orm";

import type { Context } from "hono";
import { loginSchema } from "../validator/auth.schema";
import { sessions, users } from "../database/schema";
import { db } from "../database";
import { env } from "../util/env";
import { clearAuthCookies, setAuthCookies } from "../util/cookies";
import { generateTokens } from "../util/jwtverify";
import { getSignedCookie } from "hono/cookie";

export const login = async (c: Context) => {
  try {
    const body = await c.req.json();

    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return c.json(
        {
          success: false,
          message: result.error.issues[0].message,
        },
        400,
      );
    }

    const { email, password } = result.data;

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      return c.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        400,
      );
    }

    const isMatch = password === user.password;

    if (!isMatch) {
      return c.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        400,
      );
    }

    // Generate access + refresh tokens
    const { accessToken, refreshToken, refreshExpDate } = await generateTokens(
      user.id,
      user.email,
    );

    // Store refresh token in database
    await db.insert(sessions).values({
      userId: user.id,
      refreshToken,
      expiresAt: refreshExpDate,
    });

    // Set accessToken + refreshToken cookies
    await setAuthCookies(c, accessToken, refreshToken);

    return c.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return c.json(
      {
        success: false,
        message: "Server error",
      },
      500,
    );
  }
};

export const logout = async (c: Context) => {
  try {
    const refreshToken = await getSignedCookie(
      c,
      env.COOKIE_SECRET,
      "refreshToken",
    );
    console.log("LOGOUT DEBUG");
    console.log("refreshToken exists:", !!refreshToken);
    if (refreshToken) {
      await db.delete(sessions).where(eq(sessions.refreshToken, refreshToken));
    }
    clearAuthCookies(c);
    return c.json({
      success: true,
      message: "Logged out successfully",
      data: null,
    });
  } catch (error) {
    console.error("LOGOUT ERROR:", error);
    clearAuthCookies(c);
    return c.json(
      {
        success: false,
        message: "Could not logout",
        error: "LOGOUT_FAILED",
        data: null,
      },
      500,
    );
  }
};
