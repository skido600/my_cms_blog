import { z } from "zod";
import "dotenv/config";

export const envSchema = z.object({
  DATABASE_URL: z.string(),
  ADMIN_EMAIL: z.string(),
  ADMIN_PASSWORD: z.string(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  CLOUDINARY_UPLOAD_PRESET: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  COOKIE_SECRET: z.string(),
  VERCEL_ENV: z.string(),
});

export const env = envSchema.parse(process.env);
