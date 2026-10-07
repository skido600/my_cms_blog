import type { Context } from "hono";
import { getSignedCookie, setSignedCookie, deleteCookie } from "hono/cookie";

import { env } from "./env";

export const FIFTEEN_MINUTES_SECONDS = 15 * 60;
export const REFRESH_TOKEN_SECONDS = 60 * 60 * 24 * 7;

const isProd = env.VERCEL_ENV === "production";

export const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: "Lax" as const,
  path: "/",
};

export async function setAuthCookies(
  c: Context,
  accessToken: string,
  refreshToken: string,
) {
  await setSignedCookie(c, "accessToken", accessToken, env.COOKIE_SECRET, {
    ...cookieOptions,
    maxAge: FIFTEEN_MINUTES_SECONDS,
  });

  await setSignedCookie(c, "refreshToken", refreshToken, env.COOKIE_SECRET, {
    ...cookieOptions,
    maxAge: REFRESH_TOKEN_SECONDS,
  });
}

export async function getAuthCookies(c: Context) {
  const accessToken = await getSignedCookie(
    c,
    env.COOKIE_SECRET,
    "accessToken",
  );

  const refreshToken = await getSignedCookie(
    c,
    env.COOKIE_SECRET,
    "refreshToken",
  );

  return {
    accessToken,
    refreshToken,
  };
}

export function clearAuthCookies(c: Context) {
  deleteCookie(c, "accessToken", {
    ...cookieOptions,
  });

  deleteCookie(c, "refreshToken", {
    ...cookieOptions,
  });
}
