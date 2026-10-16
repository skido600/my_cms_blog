export const Spinner = () => (
  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      className="opacity-25"
    />
    <path
      d="M4 12a8 8 0 0 1 8-8"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      className="opacity-75"
    />
  </svg>
);
export const primaryBtn =
  "inline-flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200";

export const ghostBtn =
  "w-full rounded-lg px-5 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800";

type Variant = "mail" | "success" | "error";
const icons: Record<Variant, { wrap: string; path: React.ReactNode }> = {
  mail: {
    wrap: "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100",
    path: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
  },
  success: {
    wrap: "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400",
    path: <path d="m5 12 5 5 9-10" />,
  },
  error: {
    wrap: "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400",
    path: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5M12 16.5v.01" />
      </>
    ),
  },
};
export const Modal = ({
  variant,
  title,
  text,
  children,
}: {
  variant: Variant;
  title: string;
  text: string;
  children?: React.ReactNode;
}) => {
  const icon = icons[variant];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        <div
          className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full ${icon.wrap}`}>
          <svg
            className="h-7 w-7"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            {icon.path}
          </svg>
        </div>

        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {text}
        </p>

        {children && <div className="mt-6 flex flex-col gap-3">{children}</div>}
      </div>
    </div>
  );
};
