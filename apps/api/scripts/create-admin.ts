import { eq } from "drizzle-orm";
import { db } from "../src/database";
import { users } from "../src/database/schema";
import { env } from "../src/util/env";

export const createAdminUser = async () => {
  const email = env.ADMIN_EMAIL;
  const password = env.ADMIN_PASSWORD;

  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser) {
    console.log("Admin user already exists");
    return;
  }

  await db.insert(users).values({
    email,
    password,
  });

  console.log("Admin user created");
};

await createAdminUser();
