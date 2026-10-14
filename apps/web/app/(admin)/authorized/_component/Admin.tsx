"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import dynamic from "next/dynamic";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useCreatePost } from "../../../../hook/post";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => (
    <div className="h-130 animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800" />
  ),
});

const DRAFT_KEY = "blog-admin-draft-v1";
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

type ArticleImage = {
  id: string;
  file: File;
  url: string;
};

type FormState = {
  title: string;
  description: string;
  categories: string[];
  headerImage: File | null;
  articleImages: ArticleImage[];
  imageCaption: string;
  featured: boolean;
};

const emptyForm: FormState = {
  title: "",
  description: "",
  categories: [],
  headerImage: null,
  articleImages: [],
  imageCaption: "",
  featured: false,
};

// Matches markdown images that point at blob: URLs.
const BLOB_IMAGE_RE = /!\[[^\]]*\]\(blob:[^)]*\)\n*/g;

const formatBytes = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

function validateImage(file: File): string | null {
  if (!file.type.startsWith("image/")) {
    return `${file.name} is not an image`;
  }

  if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
    return `${file.name} is larger than ${MAX_IMAGE_MB} MB`;
  }

  return null;
}

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

/** Follows the `dark` class on <html>. */
function useIsDark() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    const update = () => {
      if (root.classList.contains("dark")) {
        return setIsDark(true);
      }

      if (root.classList.contains("light")) {
        return setIsDark(false);
      }

      setIsDark(mq.matches);
    };

    update();

    const observer = new MutationObserver(update);

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });

    mq.addEventListener("change", update);

    return () => {
      observer.disconnect();
      mq.removeEventListener("change", update);
    };
  }, []);

  return isDark;
}

function Card({
  title,
  hint,
  children,
}: {
  title?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-neutral-300 bg-white p-5 dark:border-neutral-800 dark:bg-[#1b1b1b]">
      {title && (
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-neutral-800 dark:text-white">
            {title}
          </h3>

          {hint && (
            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
              {hint}
            </p>
          )}
        </div>
      )}

      {children}
    </section>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p role="alert" className="mt-1.5 text-xs font-medium text-red-500">
      {message}
    </p>
  );
}

export default function Admin() {
  const [formData, setFormData] = useState<FormState>(emptyForm);
  const [categoryInput, setCategoryInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<Date | null>(null);
  const [fileInputKey, setFileInputKey] = useState(() => Date.now());

  const { mutateAsync: createPost, isPending } = useCreatePost();

  const isDark = useIsDark();

  const formRef = useRef<HTMLFormElement>(null);
  const draftLoaded = useRef(false);
  const imagesRef = useRef<ArticleImage[]>([]);

  const headerPreview = useObjectUrl(formData.headerImage);

  imagesRef.current = formData.articleImages;

  const {
    register,
    control,
    handleSubmit: rhfHandleSubmit,
    setValue,
    trigger,
    clearErrors,
    formState: { errors },
  } = useForm<FormState>({
    defaultValues: emptyForm,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);

      if (raw) {
        const draft = JSON.parse(raw) as Partial<FormState>;

        const restored = {
          title: draft.title ?? "",
          description: draft.description ?? "",
          categories: Array.isArray(draft.categories) ? draft.categories : [],
          imageCaption: draft.imageCaption ?? "",
          featured: Boolean(draft.featured),
        };

        setFormData((prev) => ({
          ...prev,
          ...restored,
        }));

        setValue("title", restored.title);
        setValue("description", restored.description);
        setValue("categories", restored.categories);
        setValue("imageCaption", restored.imageCaption);
        setValue("featured", restored.featured);

        if (draft.title || draft.description) {
          toast("Restored your unsaved draft");
        }
      }
    } catch {
      /* storage unavailable or corrupted: ignore */
    }

    draftLoaded.current = true;
  }, [setValue]);

  useEffect(() => {
    if (!draftLoaded.current) return;

    const timer = setTimeout(() => {
      try {
        const { title, description, categories, imageCaption, featured } =
          formData;

        const hasContent =
          Boolean(title.trim()) ||
          Boolean(description.trim()) ||
          categories.length > 0;

        if (!hasContent) {
          localStorage.removeItem(DRAFT_KEY);
          setDraftSavedAt(null);
          return;
        }

        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({
            title,
            description: description.replace(BLOB_IMAGE_RE, ""),
            categories,
            imageCaption,
            featured,
          }),
        );

        setDraftSavedAt(new Date());
      } catch {
        /* ignore */
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [
    formData.title,
    formData.description,
    formData.categories,
    formData.imageCaption,
    formData.featured,
  ]);

  /* ------------------------ Warn before leaving page ---------------------- */

  const isDirty = Boolean(
    formData.title ||
    formData.description.trim() ||
    formData.categories.length ||
    formData.headerImage ||
    formData.articleImages.length,
  );

  useEffect(() => {
    if (!isDirty) return;

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);

    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  /* ----------------------- Cmd/Ctrl + S submits the form ------------------ */

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };

    window.addEventListener("keydown", handler);

    return () => window.removeEventListener("keydown", handler);
  }, []);

  /* ----------------- Revoke article image URLs on unmount ----------------- */

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, []);

  /* --------------------------------- Stats -------------------------------- */

  const stats = useMemo(() => {
    const text = formData.description
      .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
      .replace(/[#>*_`~\-\[\]()]/g, " ");

    const words = text.trim() ? text.trim().split(/\s+/).length : 0;

    return {
      words,
      minutes: Math.max(1, Math.ceil(words / 200)),
    };
  }, [formData.description]);

  /* -------------------------------- Handlers ------------------------------ */

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));

    setValue(key, value as never);

    if (
      key === "title" ||
      key === "description" ||
      key === "categories" ||
      key === "headerImage"
    ) {
      clearErrors(key);
    }
  };

  /* ------------------------------- Categories ----------------------------- */

  const addCategory = useCallback(
    (raw: string) => {
      const newCategories = raw
        .split(",")
        .map((category) => category.trim())
        .filter(Boolean);

      if (newCategories.length === 0) return;

      setFormData((prev) => {
        const existing = new Set(
          prev.categories.map((category) => category.toLowerCase()),
        );

        const categoriesToAdd = newCategories.filter(
          (category) => !existing.has(category.toLowerCase()),
        );

        if (categoriesToAdd.length === 0) {
          return prev;
        }

        const categories = [...prev.categories, ...categoriesToAdd];

        setValue("categories", categories);

        return {
          ...prev,
          categories,
        };
      });

      clearErrors("categories");
      setCategoryInput("");
    },
    [clearErrors, setValue],
  );

  const removeCategory = (name: string) => {
    setFormData((prev) => {
      const categories = prev.categories.filter((c) => c !== name);

      setValue("categories", categories);

      return {
        ...prev,
        categories,
      };
    });
  };

  const handleCategoryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addCategory(categoryInput);
    } else if (e.key === "Backspace" && !categoryInput) {
      const last = formData.categories[formData.categories.length - 1];

      if (last !== undefined) {
        removeCategory(last);
      }
    }
  };

  /* ------------------------------ Header image ---------------------------- */

  const setHeaderFile = (file: File | null) => {
    if (file) {
      const problem = validateImage(file);

      if (problem) {
        toast.error(problem, {
          style: errorToastStyle,
        });

        return;
      }
    }

    update("headerImage", file);

    if (file) {
      clearErrors("headerImage");
    }
  };

  const handleHeaderDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0] ?? null;

    setHeaderFile(file);
  };

  /* -------------------------------- Reset --------------------------------- */

  const resetForm = () => {
    imagesRef.current.forEach((img) => URL.revokeObjectURL(img.url));

    setFormData(emptyForm);
    setCategoryInput("");
    setFileInputKey(Date.now());

    setValue("title", "");
    setValue("description", "");
    setValue("categories", []);
    setValue("headerImage", null);
    setValue("articleImages", []);
    setValue("imageCaption", "");
    setValue("featured", false);

    clearErrors();

    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }

    setDraftSavedAt(null);
  };

  const handleClear = () => {
    if (!isDirty) return;

    if (window.confirm("Discard everything and start over?")) {
      resetForm();
    }
  };

  /* -------------------------------- Submit -------------------------------- */

  const onSubmit = async (data: FormState) => {
    /*
     * Include categories that were typed but not yet added.
     *
     * Example:
     * "tech, agric, programming"
     * becomes:
     * ["tech", "agric", "programming"]
     */
    const finalCategories = [...data.categories];

    const pending = categoryInput.trim();

    if (pending) {
      const pendingCategories = pending
        .split(",")
        .map((category) => category.trim())
        .filter(Boolean);

      for (const category of pendingCategories) {
        if (
          !finalCategories.some(
            (existing) => existing.toLowerCase() === category.toLowerCase(),
          )
        ) {
          finalCategories.push(category);
        }
      }
    }

    if (finalCategories.length === 0) {
      toast.error("Please fix the highlighted fields", {
        style: errorToastStyle,
      });

      return;
    }

    const form = new FormData();

    form.append("title", data.title.trim());
    form.append("description", data.description);
    form.append("categories", JSON.stringify(finalCategories));
    form.append("imageCaption", data.imageCaption);
    form.append("featured", String(data.featured));

    if (data.headerImage) {
      form.append("headerImage", data.headerImage);
    }

    data.articleImages.forEach((img) => {
      form.append("articleImages", img.file);
    });

    try {
      await createPost(form);

      toast.success("Post created successfully!", {
        style: successToastStyle,
      });

      resetForm();
    } catch (err) {
      console.error(err);

      toast.error(err instanceof Error ? err.message : "Something went wrong", {
        style: errorToastStyle,
      });
    }
  };

  const submitForm = async () => {
    /*
     * Add any pending comma-separated categories before RHF validation.
     */
    const pending = categoryInput.trim();

    if (pending) {
      const pendingCategories = pending
        .split(",")
        .map((category) => category.trim())
        .filter(Boolean);

      const categories = [...formData.categories];

      for (const category of pendingCategories) {
        if (
          !categories.some(
            (existing) => existing.toLowerCase() === category.toLowerCase(),
          )
        ) {
          categories.push(category);
        }
      }

      setFormData((prev) => ({
        ...prev,
        categories,
      }));

      setValue("categories", categories);
    }

    const valid = await trigger([
      "title",
      "description",
      "categories",
      "headerImage",
    ]);

    if (!valid) {
      toast.error("Please fix the highlighted fields", {
        style: errorToastStyle,
      });

      return;
    }

    await rhfHandleSubmit(onSubmit)();
  };

  /* --------------------------------- Render ------------------------------- */

  return (
    <div className="min-h-screen">
      <form
        id="post-form"
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          void submitForm();
        }}
        noValidate>
        {/* Sticky action bar */}

        <header className="sticky top-0 z-20 -mx-2 mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-300 bg-white/85 px-4 py-3 backdrop-blur dark:border-neutral-800 dark:bg-[#1b1b1b]/85">
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              Create Post
            </h2>

            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {stats.words} {stats.words === 1 ? "word" : "words"} ·{" "}
              {stats.minutes} min read
              {draftSavedAt && (
                <>
                  {" "}
                  · Draft saved{" "}
                  {draftSavedAt.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClear}
              disabled={!isDirty || isPending}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800">
              Clear
            </button>

            <button
              type="submit"
              disabled={isPending}
              title="Cmd/Ctrl + S"
              className="inline-flex items-center gap-2 rounded-lg bg-[#213555] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1a2f45] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-[#1b1b1b]">
              {isPending && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}

              {isPending ? "Publishing…" : "Publish"}
            </button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* ------------------------------ Main column ------------------------------ */}

          <div className="space-y-6">
            {/* Title */}

            <Card>
              <label
                htmlFor="title"
                className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-200">
                Title<span className="text-red-500">*</span>
              </label>

              <input
                id="title"
                type="text"
                maxLength={150}
                placeholder="A headline worth clicking"
                {...register("title", {
                  required: "Give your post a title.",
                  validate: (value) =>
                    value.trim().length > 0 || "Give your post a title.",
                })}
                value={formData.title}
                onChange={(e) => update("title", e.target.value)}
                aria-invalid={!!errors.title}
                className={`${inputClass} py-3! text-lg font-semibold ${
                  errors.title ? "border-red-500! ring-red-500/30!" : ""
                }`}
              />

              <div className="mt-1.5 flex items-start justify-between gap-3">
                <FieldError message={errors.title?.message} />

                <span className="ml-auto text-xs text-neutral-400">
                  {formData.title.length}/150
                </span>
              </div>
            </Card>

            {/* Content */}

            <Card>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                  Content<span className="text-red-500">*</span>
                </label>

                <span className="text-xs text-neutral-400">
                  Markdown supported
                </span>
              </div>

              <div
                data-color-mode={isDark ? "dark" : "light"}
                className={`overflow-hidden rounded-lg border ${
                  errors.description
                    ? "border-red-500"
                    : "border-neutral-300 dark:border-neutral-700"
                }`}>
                <Controller
                  name="description"
                  control={control}
                  rules={{
                    required: "Write something for the post body.",
                    validate: (value) =>
                      value.trim().length > 0 ||
                      "Write something for the post body.",
                  }}
                  render={({ field }) => (
                    <MDEditor
                      value={field.value}
                      onChange={(value = "") => {
                        field.onChange(value);

                        setFormData((prev) => ({
                          ...prev,
                          description: value,
                        }));

                        if (value.trim()) {
                          clearErrors("description");
                        }
                      }}
                      height={520}
                      preview="live"
                      visibleDragbar={false}
                      textareaProps={{
                        placeholder:
                          "Start writing… use the toolbar or Markdown shortcuts.",
                      }}
                      style={{
                        whiteSpace: "pre-wrap",
                      }}
                    />
                  )}
                />
              </div>

              <FieldError message={errors.description?.message} />
            </Card>
          </div>

          <aside className="space-y-6">
            {/* Visibility */}

            <Card title="Visibility">
              <label
                htmlFor="featured"
                className="flex cursor-pointer items-center justify-between gap-3">
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
                    id="featured"
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => update("featured", e.target.checked)}
                    className="peer sr-only"
                  />

                  <span className="absolute inset-0 rounded-full bg-neutral-300 transition peer-checked:bg-blue-600 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500/50 dark:bg-neutral-700" />

                  <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
                </span>
              </label>
            </Card>

            {/* Header image */}

            <Card
              title="Header image*"
              hint={`PNG, JPG or WebP up to ${MAX_IMAGE_MB} MB`}>
              {headerPreview ? (
                <div className="group relative overflow-hidden rounded-lg border border-neutral-300 dark:border-neutral-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}

                  <img
                    src={headerPreview}
                    alt="Header preview"
                    className="aspect-video w-full object-cover"
                  />

                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-linear-to-t from-black/70 to-transparent p-2 text-xs text-white">
                    <span className="truncate">
                      {formData.headerImage?.name} ·{" "}
                      {formData.headerImage &&
                        formatBytes(formData.headerImage.size)}
                    </span>

                    <button
                      type="button"
                      onClick={() => setHeaderFile(null)}
                      className="rounded-md bg-white/20 px-2 py-1 font-medium backdrop-blur hover:bg-white/30">
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="headerImage"
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleHeaderDrop}
                  className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed px-4 py-8 text-center transition ${
                    isDragging
                      ? "border-blue-500 bg-blue-500/10"
                      : errors.headerImage
                        ? "border-red-500"
                        : "border-neutral-300 hover:border-neutral-400 dark:border-neutral-700 dark:hover:border-neutral-500"
                  }`}>
                  <span className="text-2xl" aria-hidden>
                    🖼️
                  </span>

                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                    Drop an image or click to browse
                  </span>
                </label>
              )}

              <Controller
                name="headerImage"
                control={control}
                rules={{
                  required: "A header image is required.",
                }}
                render={({ field }) => (
                  <input
                    id="headerImage"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;

                      setHeaderFile(file);
                      field.onChange(file);

                      e.target.value = "";
                    }}
                  />
                )}
              />

              <FieldError message={errors.headerImage?.message} />

              <div className="mt-4">
                <label
                  htmlFor="imageCaption"
                  className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-200">
                  Image caption
                </label>

                <input
                  id="imageCaption"
                  type="text"
                  value={formData.imageCaption}
                  onChange={(e) => update("imageCaption", e.target.value)}
                  placeholder="Optional"
                  className={inputClass}
                />
              </div>
            </Card>

            {/* Categories */}

            <Card title="Categories*" hint="Press Enter or comma to add">
              <div
                className={`flex flex-wrap items-center gap-2 rounded-lg border bg-white p-2 focus-within:ring-2 focus-within:ring-blue-500/30 dark:bg-[#141414] ${
                  errors.categories
                    ? "border-red-500"
                    : "border-neutral-300 focus-within:border-blue-500 dark:border-neutral-700"
                }`}>
                {formData.categories.map((category) => (
                  <span
                    key={category}
                    className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                    {category}

                    <button
                      type="button"
                      onClick={() => removeCategory(category)}
                      aria-label={`Remove ${category}`}
                      className="text-blue-500 hover:text-red-500">
                      ×
                    </button>
                  </span>
                ))}

                <Controller
                  name="categories"
                  control={control}
                  rules={{
                    validate: (value) =>
                      value.length > 0 || "Add at least one category.",
                  }}
                  render={() => (
                    <input
                      type="text"
                      value={categoryInput}
                      onChange={(e) => setCategoryInput(e.target.value)}
                      onKeyDown={handleCategoryKeyDown}
                      onBlur={() => addCategory(categoryInput)}
                      placeholder={
                        formData.categories.length
                          ? "Add another…"
                          : "e.g. Technology"
                      }
                      className="min-w-27.5 flex-1 bg-transparent px-1 py-1 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-white"
                    />
                  )}
                />
              </div>

              <FieldError message={errors.categories?.message} />
            </Card>
          </aside>
        </div>
      </form>
    </div>
  );
}
