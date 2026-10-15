"use client";

import { useState } from "react";
import Image from "next/image";
import {
  useGetAllCategories,
  useGetPostsByCategory,
  useGetAllPosts,
} from "../../hook/post";

interface Post {
  id: string;
  title: string;
  slug: string;
  header_Image_UrL?: string;
}

export default function Categories() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data, isPending, isError } = useGetAllCategories();

  const {
    data: allPostsData,
    isPending: postsPending,
    isError: postsError,
  } = useGetAllPosts();

  console.log("allPostsData", allPostsData);
  const { data: categoryPostsData, isPending: categoryPostsPending } =
    useGetPostsByCategory(selectedCategory ?? "");

  const categories: string[] = data?.categories ?? [];
  const allPosts: Post[] = allPostsData?.posts ?? [];
  const categoryPosts: Post[] = categoryPostsData?.posts ?? [];

  const displayedPosts = selectedCategory ? categoryPosts : allPosts;

  return (
    <section className="w-full flex flex-col p-5 xs:p-10 sm:p-12 md:p-16 lg:p-20 border-b-2 border-solid dark:border-neutral-800 text-dark dark:text-light">
      <ul className="flex flex-wrap mt-8 justify-center xs:justify-start">
        <li
          onClick={() => setSelectedCategory(null)}
          className={`font-semibold capitalize text-base xs:text-lg sm:text-xl md:text-2xl py-2 xs:py-3 sm:py-4 lg:py-5 px-4 xs:px-6 sm:px-8 lg:px-12 border-2 border-solid border-dark dark:border-light rounded mr-3 mb-3 xs:mr-4 xs:mb-4 md:mr-6 md:mb-6 hover:scale-105 transition-all ease duration-200 cursor-pointer ${
            selectedCategory === null
              ? "bg-dark text-light dark:bg-light dark:text-dark"
              : ""
          }`}>
          All
        </li>

        {isPending ? (
          Array.from({ length: 4 }).map((_, i) => (
            <li
              key={i}
              className="mr-3 mb-3 xs:mr-4 xs:mb-4 md:mr-6 md:mb-6 h-12 w-24 xs:h-14 xs:w-32 sm:h-16 sm:w-40 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800"
            />
          ))
        ) : isError ? (
          <li className="text-sm text-neutral-500">
            Failed to load categories.
          </li>
        ) : (
          categories.map((category) => (
            <li
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`font-semibold inline-block capitalize text-base xs:text-lg sm:text-xl md:text-2xl py-2 xs:py-3 sm:py-4 lg:py-5 px-4 xs:px-6 sm:px-8 lg:px-12 border-2 border-solid border-dark dark:border-light rounded mr-3 mb-3 xs:mr-4 xs:mb-4 md:mr-6 md:mb-6 hover:scale-105 transition-all ease duration-200 cursor-pointer dark:font-normal ${
                selectedCategory === category
                  ? "bg-dark text-light dark:bg-light dark:text-dark"
                  : ""
              }`}>
              {category}
            </li>
          ))
        )}
      </ul>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {postsPending || (selectedCategory && categoryPostsPending) ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-lg border dark:border-neutral-800">
              <div className="aspect-16/10 w-full animate-pulse bg-neutral-200 dark:bg-neutral-800" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-3/4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
                <div className="h-4 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
              </div>
            </div>
          ))
        ) : postsError ? (
          <p className="col-span-full">Failed to load posts.</p>
        ) : displayedPosts.length === 0 ? (
          <p className="col-span-full">No posts found.</p>
        ) : (
          displayedPosts.map((post) => (
            <article
              key={post.id}
              className="overflow-hidden rounded-lg border dark:border-neutral-800">
              <div className="relative aspect-16/10 w-full bg-neutral-200 dark:bg-neutral-800">
                {post.header_Image_UrL && (
                  <Image
                    src={post.header_Image_UrL}
                    alt={post.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                )}
              </div>

              <div className="p-5">
                <h2 className="text-xl font-bold">{post.title}</h2>
                <a
                  href={`/posts/${post.slug}`}
                  className="mt-3 inline-block underline">
                  Read post
                </a>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
