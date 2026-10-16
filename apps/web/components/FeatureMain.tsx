"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { useGetAllPosts } from "../hook/post";
import { PostsSkeleton } from "../helper/PostsSkeleton";
import { PostImage } from "./PostImage";

interface Post {
  slug: string;
  title: string;

  categories: string[];
  date: string;
  readTime: string;
  header_Image_UrL?: string;
}

const MAX_POSTS = 6;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    categories: categories.length ? categories : ["General"],
    date: rawDate
      ? new Date(rawDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "",
    readTime: `${p.readTime} min read`,
    header_Image_UrL: p.header_Image_UrL ?? undefined,
  };
}

function FeaturedCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/post/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:shadow-lg md:col-span-2 lg:row-span-2 dark:border-neutral-800 dark:bg-neutral-900">
      <PostImage
        header_Image_UrL={post.header_Image_UrL}
        title={post.title}
        className="aspect-video w-full lg:aspect-auto lg:min-h-80 lg:flex-1"
      />

      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex flex-wrap gap-2">
            {post.categories.slice(0, 3).map((cat) => (
              <span
                key={cat}
                className="rounded-full bg-black px-3 py-1 font-medium capitalize text-white dark:bg-white dark:text-black">
                {cat}
              </span>
            ))}
          </div>
          <span>{post.date}</span>
        </div>

        <h3 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-neutral-950 sm:text-3xl dark:text-white">
          {post.title}
        </h3>

        <div className="mt-5 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
            <Clock size={14} />
            {post.readTime}
          </span>
          <span className="flex items-center gap-1 text-sm font-medium text-neutral-950 dark:text-white">
            Read more
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/post/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
      <PostImage
        header_Image_UrL={post.header_Image_UrL}
        title={post.title}
        className="aspect-16/10 w-full"
      />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex flex-wrap gap-2">
            {post.categories.slice(0, 3).map((cat) => (
              <span
                key={cat}
                className="rounded-full bg-black px-3 py-1 font-medium capitalize text-white dark:bg-white dark:text-black">
                {cat}
              </span>
            ))}
          </div>
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

function Feature() {
  const { data, isLoading, isError } = useGetAllPosts();

  console.log(data, "data");

  const rawPosts: unknown[] = Array.isArray(data)
    ? data
    : (data?.posts ?? data?.data ?? []);

  const posts = rawPosts.slice(0, MAX_POSTS).map(normalizePost);
  const [featured, ...others] = posts;

  return (
    <section className="px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl dark:text-white">
              Featured posts
            </h2>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Hand-picked stories and ideas worth your time.
            </p>
          </div>
        </div>

        {isLoading ? (
          <PostsSkeleton />
        ) : isError ? (
          <p className="rounded-2xl border border-neutral-200 p-8 text-center text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
            Couldn&apos;t load posts right now. Please try again later.
          </p>
        ) : !featured ? (
          <p className="rounded-2xl border border-neutral-200 p-8 text-center text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
            No posts yet. Check back soon.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeaturedCard post={featured} />
            {others.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}

        <Link
          href="/posts"
          className="mt-8 flex items-center justify-center gap-1 text-sm font-medium text-neutral-950 hover:underline sm:hidden dark:text-white">
          View all
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

export default Feature;
