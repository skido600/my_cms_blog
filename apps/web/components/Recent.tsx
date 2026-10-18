/*eslint-disable*/
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { useGetRecentPosts } from "../hook/post";

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  categories: string[];
  date: string;
  readTime: string;
  header_Image_UrL?: string;
}

const MAX_POSTS = 6;

function normalizePost(p: any): Post {
  const rawDate = p.createdAt ?? p.publishedAt ?? p.date;

  const rawCategories = p.categories ?? p.category ?? p.tags ?? [];
  const categories = (
    Array.isArray(rawCategories) ? rawCategories : [rawCategories]
  )
    .map((c: unknown) =>
      typeof c === "string" ? c : (c as { name?: string } | null)?.name,
    )
    .filter(Boolean) as string[];

  return {
    slug: String(p.slug ?? p._id ?? p.id ?? ""),
    title: p.title ?? "Untitled",
    excerpt: p.excerpt ?? p.description ?? p.summary ?? "",
    categories: categories.length ? categories : ["General"],
    date: rawDate
      ? new Date(rawDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "",
    readTime: p.readTime && `${p.readTime} min read`,
    header_Image_UrL:
      p.header_Image_UrL ?? p.image ?? p.coverImage ?? p.thumbnail ?? undefined,
  };
}

function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/post/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
      <div className="relative aspect-16/10 w-full overflow-hidden bg-linear-to-br from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-700">
        {post.header_Image_UrL && (
          <Image
            src={post.header_Image_UrL}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
          {post.categories.slice(0, 3).map((cat) => (
            <span
              key={cat}
              className="rounded-full bg-black px-3 py-1 font-medium capitalize text-white dark:bg-white dark:text-black">
              {cat}
            </span>
          ))}
          <span>{post.date}</span>
        </div>

        <h3 className="mt-3 line-clamp-2 text-lg font-semibold leading-snug text-neutral-950 dark:text-white">
          {post.title}
        </h3>

        <span className="mt-auto flex items-center gap-1.5 pt-4 text-xs text-neutral-500 dark:text-neutral-400">
          <Clock size={14} />
          {post.readTime}
        </span>
      </div>
    </Link>
  );
}

function PostsSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: MAX_POSTS }).map((_, i) => (
        <div
          key={i}
          className="h-80 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800"
        />
      ))}
    </div>
  );
}

function Recent() {
  const { data, isLoading, isError } = useGetRecentPosts();

  // Accepts
  const rawPosts: unknown[] = Array.isArray(data)
    ? data
    : (data?.posts ?? data?.data ?? []);

  const posts = rawPosts.slice(0, MAX_POSTS).map(normalizePost);

  return (
    <section className="px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl dark:text-white">
              Recent posts
            </h2>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Hand-picked stories and ideas worth your time.
            </p>
          </div>

          <Link
            href="/all"
            className="group flex shrink-0 items-center gap-1 text-sm font-medium text-neutral-950 dark:text-white">
            View all
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {isLoading ? (
          <PostsSkeleton />
        ) : isError ? (
          <p className="rounded-2xl border border-neutral-200 p-8 text-center text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
            Couldn&apos;t load posts right now. Please try again later.
          </p>
        ) : posts.length === 0 ? (
          <p className="rounded-2xl border border-neutral-200 p-8 text-center text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
            No posts yet. Check back soon.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Recent;
