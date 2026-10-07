CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"description" text NOT NULL,
	"user_id" uuid NOT NULL,
	"header_image" text,
	"article_images" jsonb DEFAULT '[]',
	"image_caption" text,
	"views" integer DEFAULT 0 NOT NULL,
	"viewed_ips" text[] DEFAULT '{}'::text[],
	"featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"email" varchar(255) NOT NULL UNIQUE,
	"password" varchar(255) NOT NULL,
	"role" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "posts_slug_unique" ON "posts" ("slug");--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");