import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email").notNull().unique(),
  password: varchar("password").notNull(),
  role: varchar("role").notNull().default("ADMIN"),
});

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    title: varchar("title").notNull(),

    slug: varchar("slug").notNull(),

    description: text("description").notNull(),
    categories: text("categories").array().default([]).notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),

    header_Image_UrL: text("header_image_url"),
    header_Image_public: text("header_image_public"),
    views: integer("views").default(0).notNull(),

    viewedIPs: text("viewed_ips").array().default([]),

    featured: boolean("featured").default(false).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },

  (table) => ({
    slugUnique: uniqueIndex("posts_slug_unique").on(table.slug),
  }),
);

export const subscribers = pgTable("subscribers", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  isActive: boolean("is_active").default(true).notNull(),
  isVerified: boolean("is_verified").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    refreshToken: text("refresh_token").notNull().unique(),

    expiresAt: timestamp("expires_at").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("sessions_user_id_idx").on(table.userId),
    index("sessions_expires_at_idx").on(table.expiresAt),
  ],
);
