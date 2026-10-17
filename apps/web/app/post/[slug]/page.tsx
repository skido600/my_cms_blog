import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPostBySlugServer } from "../../../services/post";
import PostClient from "../../../components/PostClient";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlugServer(slug);

  if (!post) return { title: "Post not found" };

  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/posts/${slug}`;

  return {
    title: post.post.title,
    description: post.post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.post.title,
      description: post.post.description,
      url,
      type: "article",
      images: [
        {
          url: post.post.header_Image_UrL,
          width: 1200,
          height: 630,
          alt: post.post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.post.title,
      description: post.post.description,
      images: [post.header_Image_UrL],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const result = await getPostBySlugServer(slug);

  const post = result?.post ?? result;
  if (!post) notFound();

  return <PostClient initialPost={post} />;
}
