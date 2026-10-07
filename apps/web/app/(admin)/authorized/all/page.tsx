"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { toast } from "sonner";
import {
  Pencil,
  Trash2,
  Plus,
  Search,
  Star,
  X,
  TriangleAlert,
} from "lucide-react";
import {
  useGetAllPosts,
  useUpdatePost,
  useDeletePost,
} from "../../../../hook/post";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => (
    <div className="h-[360px] animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800" />
  ),
});

/* -------------------------------------------------------------------------- */
/*                               Types & helpers                              */
/* -------------------------------------------------------------------------- */

type Post = {
  id: string;
  title: string;
  slug?: string;
  description: string;
  categories: string[];
  header_Image_UrL: string;
  featured: boolean;
  createdAt?: string;
  created_at?: string;
};

const MAX_IMAGE_MB = 10;

const successToastStyle = {
  backgroundColor: "#48BB78",
  color: "white",
  border: "none",
};
const errorToastStyle = {
  backgroundColor: "#F56565",
  color: "white",
  border: "none",
};

const inputClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:border-neutral-700 dark:bg-[#141414] dark:text-white dark:placeholder:text-neutral-500";

const postDate = (post: Post) => post.createdAt ?? post.created_at;

const formatDate = (post: Post) => {
  const raw = postDate(post);
  if (!raw) return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime())
    ? null
    : date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
};

const excerptOf = (markdown: string) =>
  markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);

function useObjectUrl(file: File | null) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return url;
}

function useIsDark() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    const update = () => {
      if (root.classList.contains("dark")) return setIsDark(true);
      if (root.classList.contains("light")) return setIsDark(false);
      setIsDark(mq.matches);
    };

    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    mq.addEventListener("change", update);

    return () => {
      observer.disconnect();
      mq.removeEventListener("change", update);
    };
  }, []);

  return isDark;
}

/* -------------------------------------------------------------------------- */
/*                                    Modal                                   */
/* -------------------------------------------------------------------------- */

function Modal({
  title,
  onClose,
  busy,
  wide,
  footer,
  children,
}: {
  title: string;
  onClose: () => void;
  busy?: boolean;
  wide?: boolean;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) closeRef.current();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [busy]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => !busy && onClose()}
        aria-hidden
      />

      <div
        className={`relative flex max-h-[92vh] w-full flex-col rounded-t-2xl border border-neutral-300 bg-white shadow-xl dark:border-neutral-800 dark:bg-[#1b1b1b] sm:rounded-xl ${
          wide ? "sm:max-w-3xl" : "sm:max-w-md"
        }`}>
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
          <h2
            id="modal-title"
            className="text-base font-semibold text-neutral-900 dark:text-white">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            aria-label="Close"
            className="rounded-md p-1.5 text-neutral-500 transition hover:bg-neutral-100 disabled:opacity-40 dark:hover:bg-neutral-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5">{children}</div>

        {footer && (
          <div className="flex justify-end gap-2 border-t border-neutral-200 px-5 py-4 dark:border-neutral-800">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
  );
}

/* -------------------------------------------------------------------------- */
/*                                Delete dialog                               */
/* -------------------------------------------------------------------------- */

function DeleteDialog({
  post,
  loading,
  onCancel,
  onConfirm,
}: {
  post: Post;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal
      title="Delete post"
      onClose={onCancel}
      busy={loading}
      footer={
        <>
          <button
            type="button"
            autoFocus
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800">
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60">
            {loading && <Spinner />}
            {loading ? "Deleting…" : "Delete"}
          </button>
        </>
      }>
      <div className="flex gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400">
          <TriangleAlert className="h-5 w-5" />
        </span>
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-neutral-900 dark:text-white">
            “{post.title}”
          </span>
          ? This can&apos;t be undone.
        </p>
      </div>
    </Modal>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Edit dialog                                */
/* -------------------------------------------------------------------------- */

function EditDialog({ post, onClose }: { post: Post; onClose: () => void }) {
  const updatePost = useUpdatePost();
  const isDark = useIsDark();

  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);
  const [categories, setCategories] = useState<string[]>(
    Array.isArray(post.categories) ? post.categories : [],
  );
  const [categoryInput, setCategoryInput] = useState("");
  const [featured, setFeatured] = useState(post.featured);
  const [headerFile, setHeaderFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<"title" | "description" | "categories", string>>
  >({});

  const newHeaderUrl = useObjectUrl(headerFile);

  const dirty =
    title !== post.title ||
    description !== post.description ||
    featured !== post.featured ||
    headerFile !== null ||
    categories.join("\u0000") !== (post.categories ?? []).join("\u0000");

  const requestClose = () => {
    if (saving) return;
    if (dirty && !window.confirm("Discard your changes?")) return;
    onClose();
  };

  const addCategory = (raw: string) => {
    const category = raw.trim().replace(/,+$/, "").trim();
    if (!category) return;
    setCategories((prev) =>
      prev.some((c) => c.toLowerCase() === category.toLowerCase())
        ? prev
        : [...prev, category],
    );
    setErrors((prev) => ({ ...prev, categories: undefined }));
    setCategoryInput("");
  };

  const handleCategoryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addCategory(categoryInput);
    } else if (e.key === "Backspace" && !categoryInput) {
      setCategories((prev) => prev.slice(0, -1));
    }
  };

  const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(`${file.name} is not an image`, { style: errorToastStyle });
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      toast.error(`${file.name} is larger than ${MAX_IMAGE_MB} MB`, {
        style: errorToastStyle,
      });
      return;
    }
    setHeaderFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;

    const finalCategories = [...categories];
    const pending = categoryInput.trim();
    if (
      pending &&
      !finalCategories.some((c) => c.toLowerCase() === pending.toLowerCase())
    ) {
      finalCategories.push(pending);
    }

    const found: typeof errors = {};
    if (!title.trim()) found.title = "Give your post a title.";
    if (!description.trim())
      found.description = "The post body can't be empty.";
    if (finalCategories.length === 0)
      found.categories = "Add at least one category.";
    setErrors(found);
    if (Object.keys(found).length) return;

    const form = new FormData();
    form.append("title", title.trim());
    form.append("description", description);
    form.append("categories", JSON.stringify(finalCategories));
    form.append("featured", String(featured));
    if (headerFile) form.append("headerImage", headerFile);

    setSaving(true);
    updatePost.mutate(
      { id: post.id, form },
      {
        onSuccess: () => {
          toast.success("Post updated", { style: successToastStyle });
          onClose();
        },
        onError: (err) => {
          toast.error((err as Error).message || "Could not update post", {
            style: errorToastStyle,
          });
        },
        onSettled: () => setSaving(false),
      },
    );
  };

  const headerPreview = newHeaderUrl ?? post.header_Image_UrL;

  return (
    <Modal
      title="Edit post"
      wide
      busy={saving}
      onClose={requestClose}
      footer={
        <>
          <button
            type="button"
            onClick={requestClose}
            disabled={saving}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800">
            Cancel
          </button>
          <button
            type="submit"
            form="edit-post-form"
            disabled={saving || !dirty}
            className="inline-flex items-center gap-2 rounded-lg bg-[#213555] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1a2f45] disabled:cursor-not-allowed disabled:opacity-50">
            {saving && <Spinner />}
            {saving ? "Saving…" : "Save changes"}
          </button>
        </>
      }>
      <form
        id="edit-post-form"
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5">
        {/* Title */}
        <div>
          <label
            htmlFor="edit-title"
            className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-200">
            Title<span className="text-red-500">*</span>
          </label>
          <input
            id="edit-title"
            type="text"
            value={title}
            maxLength={150}
            onChange={(e) => {
              setTitle(e.target.value);
              setErrors((prev) => ({ ...prev, title: undefined }));
            }}
            aria-invalid={!!errors.title}
            className={`${inputClass} ${errors.title ? "!border-red-500 !ring-red-500/30" : ""}`}
          />
          {errors.title && (
            <p className="mt-1.5 text-xs font-medium text-red-500">
              {errors.title}
            </p>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-200">
            Content<span className="text-red-500">*</span>
          </label>
          <div
            data-color-mode={isDark ? "dark" : "light"}
            className={`overflow-hidden rounded-lg border ${
              errors.description
                ? "border-red-500"
                : "border-neutral-300 dark:border-neutral-700"
            }`}>
            <MDEditor
              value={description}
              onChange={(value = "") => {
                setDescription(value);
                setErrors((prev) => ({ ...prev, description: undefined }));
              }}
              height={360}
              preview="edit"
              visibleDragbar={false}
            />
          </div>
          {errors.description && (
            <p className="mt-1.5 text-xs font-medium text-red-500">
              {errors.description}
            </p>
          )}
        </div>

        {/* Categories */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-200">
            Categories<span className="text-red-500">*</span>
          </label>
          <div
            className={`flex flex-wrap items-center gap-2 rounded-lg border bg-white p-2 focus-within:ring-2 focus-within:ring-blue-500/30 dark:bg-[#141414] ${
              errors.categories
                ? "border-red-500"
                : "border-neutral-300 focus-within:border-blue-500 dark:border-neutral-700"
            }`}>
            {categories.map((category) => (
              <span
                key={category}
                className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                {category}
                <button
                  type="button"
                  onClick={() =>
                    setCategories((prev) => prev.filter((c) => c !== category))
                  }
                  aria-label={`Remove ${category}`}
                  className="text-blue-500 hover:text-red-500">
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              onKeyDown={handleCategoryKeyDown}
              onBlur={() => addCategory(categoryInput)}
              placeholder={
                categories.length ? "Add another…" : "e.g. Technology"
              }
              className="min-w-[110px] flex-1 bg-transparent px-1 py-1 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-white"
            />
          </div>
          {errors.categories && (
            <p className="mt-1.5 text-xs font-medium text-red-500">
              {errors.categories}
            </p>
          )}
        </div>

        {/* Header image + featured */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="mb-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-200">
              Header image
            </p>
            <div className="flex items-center gap-3">
              {headerPreview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={headerPreview}
                  alt="Header preview"
                  className="h-16 w-24 shrink-0 rounded-lg border border-neutral-300 object-cover dark:border-neutral-700"
                />
              )}
              <label className="cursor-pointer rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800">
                {headerFile ? "Choose another" : "Replace"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeaderChange}
                  className="sr-only"
                />
              </label>
            </div>
            {headerFile && (
              <p className="mt-1.5 truncate text-xs text-neutral-500">
                New: {headerFile.name}
              </p>
            )}
          </div>

          <label
            htmlFor="edit-featured"
            className="flex cursor-pointer items-center justify-between gap-3 self-start rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
            <span>
              <span className="block text-sm font-medium text-neutral-800 dark:text-white">
                Feature this post
              </span>
              <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                Highlight it on the homepage
              </span>
            </span>
            <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
              <input
                id="edit-featured"
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="peer sr-only"
              />
              <span className="absolute inset-0 rounded-full bg-neutral-300 transition peer-checked:bg-blue-600 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500/50 dark:bg-neutral-700" />
              <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
            </span>
          </label>
        </div>
      </form>
    </Modal>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Post row                                  */
/* -------------------------------------------------------------------------- */

function PostRow({
  post,
  onEdit,
  onDelete,
}: {
  post: Post;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const categories = Array.isArray(post.categories) ? post.categories : [];
  const date = formatDate(post);
  const excerpt = excerptOf(post.description ?? "");

  return (
    <li className="flex flex-col gap-4 rounded-xl border border-neutral-300 bg-white p-4 transition hover:border-neutral-400 dark:border-neutral-800 dark:bg-[#1b1b1b] dark:hover:border-neutral-700 sm:flex-row sm:items-center">
      {post.header_Image_UrL ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.header_Image_UrL}
          alt=""
          loading="lazy"
          className="h-40 w-full shrink-0 rounded-lg object-cover sm:h-20 sm:w-32"
        />
      ) : (
        <div className="h-40 w-full shrink-0 rounded-lg bg-neutral-100 dark:bg-neutral-800 sm:h-20 sm:w-32" />
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-base font-semibold text-neutral-900 dark:text-white">
            {post.title}
          </h3>
          {post.featured && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
              <Star className="h-3 w-3" /> Featured
            </span>
          )}
        </div>

        {excerpt && (
          <p className="mt-1 line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">
            {excerpt}
          </p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-2">
          {categories.slice(0, 3).map((category) => (
            <span
              key={category}
              className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
              {category}
            </span>
          ))}
          {categories.length > 3 && (
            <span className="text-xs text-neutral-400">
              +{categories.length - 3}
            </span>
          )}
          {date && <span className="text-xs text-neutral-400">· {date}</span>}
        </div>
      </div>

      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800 sm:flex-none">
          <Pencil className="h-4 w-4" /> Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label={`Delete ${post.title}`}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-red-600 transition hover:border-red-300 hover:bg-red-50 dark:border-neutral-700 dark:text-red-400 dark:hover:border-red-500/40 dark:hover:bg-red-500/10 sm:flex-none">
          <Trash2 className="h-4 w-4" /> Delete
        </button>
      </div>
    </li>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    Page                                    */
/* -------------------------------------------------------------------------- */

export default function AllPosts() {
  const { data, isLoading, isError, error, refetch } = useGetAllPosts();
  const deletePost = useDeletePost();

  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Post | null>(null);
  const [deleting, setDeleting] = useState<Post | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Accept either `[...]` or `{ posts: [...] }` from the API.
  const posts = useMemo<Post[]>(() => {
    const raw = data as unknown;
    const list = Array.isArray(raw)
      ? raw
      : Array.isArray((raw as { posts?: unknown } | undefined)?.posts)
        ? ((raw as { posts: unknown[] }).posts as Post[])
        : [];

    const time = (p: Post) => Date.parse(postDate(p) ?? "") || 0;
    return [...(list as Post[])].sort((a, b) => time(b) - time(a));
  }, [data]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        (Array.isArray(p.categories) &&
          p.categories.some((c) => c.toLowerCase().includes(q))),
    );
  }, [posts, query]);

  const confirmDelete = () => {
    if (!deleting || isDeleting) return;

    setIsDeleting(true);
    deletePost.mutate(deleting.id, {
      onSuccess: () => {
        toast.success("Post deleted", { style: successToastStyle });
        setDeleting(null);
      },
      onError: (err) => {
        toast.error((err as Error).message || "Could not delete post", {
          style: errorToastStyle,
        });
      },
      onSettled: () => setIsDeleting(false),
    });
  };

  return (
    <section className="min-h-screen">
      {/* Header */}
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            All posts
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {isLoading
              ? "Loading…"
              : `${posts.length} ${posts.length === 1 ? "post" : "posts"}`}
          </p>
        </div>

        <Link
          href="/authorized/admin"
          className="inline-flex items-center gap-2 rounded-lg bg-[#213555] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1a2f45]">
          <Plus className="h-4 w-4" /> New post
        </Link>
      </header>

      {/* Search */}
      <div className="relative mb-5">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or category"
          aria-label="Search posts"
          className={`${inputClass} !pl-10`}
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <ul className="space-y-3" aria-busy>
          {Array.from({ length: 4 }).map((_, i) => (
            <li
              key={i}
              className="h-28 animate-pulse rounded-xl border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800/50"
            />
          ))}
        </ul>
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-500/30 dark:bg-red-500/10">
          <p className="text-sm font-medium text-red-700 dark:text-red-300">
            {(error as Error)?.message || "Couldn't load your posts."}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700">
            Try again
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 p-10 text-center dark:border-neutral-700">
          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
            No posts yet
          </p>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Create your first post to see it here.
          </p>
          <Link
            href="/authorized/admin"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#213555] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1a2f45]">
            <Plus className="h-4 w-4" /> New post
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-300 p-10 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
          No posts match “{query}”.
        </p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((post) => (
            <PostRow
              key={post.id}
              post={post}
              onEdit={() => setEditing(post)}
              onDelete={() => setDeleting(post)}
            />
          ))}
        </ul>
      )}

      {/* Dialogs */}
      {editing && (
        <EditDialog
          key={editing.id}
          post={editing}
          onClose={() => setEditing(null)}
        />
      )}

      {deleting && (
        <DeleteDialog
          post={deleting}
          loading={isDeleting}
          onCancel={() => setDeleting(null)}
          onConfirm={confirmDelete}
        />
      )}
    </section>
  );
}
