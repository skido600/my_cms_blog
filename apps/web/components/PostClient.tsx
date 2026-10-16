"use client";

import Image from "next/image";
import { Suspense, lazy } from "react";
import { CalendarDays, Clock, Eye } from "lucide-react";

const MarkdownRenderer = lazy(() => import("./MarkdownRenderer"));

interface PostData {
  title: string;
  description?: string;
  header_Image_UrL?: string;
  categories?: string[];
  createdAt?: string;
  readTime?: string;
  views?: string;
}

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function PostClient({ initialPost }: { initialPost: PostData }) {
  const date = formatDate(initialPost.createdAt);

  return (
    <section className="mx-auto w-full px-4 py-10 sm:max-w-[95%] lg:max-w-[75%]">
      {initialPost.header_Image_UrL && (
        <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-xl bg-neutral-200 dark:bg-neutral-800">
          <Image
            src={initialPost.header_Image_UrL}
            alt={initialPost.title}
            fill
            priority
            sizes="(min-width: 896px) 896px, 100vw"
            className="object-cover"
          />
        </div>
      )}

      {(date || initialPost.readTime || initialPost.views) && (
        <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-neutral-200 bg-neutral-100 px-4 py-3 text-sm text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
          {date && (
            <span className="flex items-center gap-2">
              <CalendarDays size={16} aria-hidden />
              <time dateTime={initialPost.createdAt}>{date}</time>
            </span>
          )}

          {initialPost.readTime && (
            <span className="flex items-center gap-2">
              <Clock size={16} aria-hidden />
              {initialPost.readTime} min read
            </span>
          )}

          {initialPost.views !== undefined && (
            <span className="flex items-center gap-2">
              <Eye size={16} aria-hidden />
              {initialPost.views} {initialPost.views === "1" ? "view" : "views"}
            </span>
          )}
        </div>
      )}

      <h1 className="mb-8 text-3xl font-bold tracking-tight text-neutral-950 dark:text-white">
        {initialPost.title}
      </h1>

      <article className="wrap-break-word">
        <Suspense fallback={null}>
          <MarkdownRenderer content={initialPost.description} />
        </Suspense>
      </article>
    </section>
  );
}
