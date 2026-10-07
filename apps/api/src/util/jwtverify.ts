import { sign } from "hono/jwt";
import { env } from "./env";
export const SEVEN_DAYS_SECONDS = 7 * 24 * 60 * 60;
export const FIFTEEN_MINUTES_SECONDS = 15 * 60;

export const generateTokens = async (userId: string, email: string) => {
  const now = Math.floor(Date.now() / 1000);

  const accessExp = now + FIFTEEN_MINUTES_SECONDS;
  const refreshExp = now + SEVEN_DAYS_SECONDS;

  const refreshExpDate = new Date(Date.now() + SEVEN_DAYS_SECONDS * 1000);

  const accessToken = await sign(
    {
      id: userId,
      email,
      exp: accessExp,
    },
    env.JWT_ACCESS_SECRET,
  );

  const refreshToken = await sign(
    {
      id: userId,
      exp: refreshExp,
    },
    env.JWT_REFRESH_SECRET,
  );

  return {
    accessToken,
    refreshToken,
    refreshExpDate,
  };
};
