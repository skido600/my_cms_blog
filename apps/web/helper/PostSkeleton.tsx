function Bar({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded bg-neutral-200 dark:bg-neutral-800 ${className}`}
    />
  );
}

export default function PostSkeleton() {
  return (
    <section
      className="mx-auto w-full animate-pulse px-4 py-10 sm:max-w-[95%] lg:max-w-[75%]"
      aria-busy="true"
      aria-label="Loading post">
      {/* header image */}
      <div className="mb-6 aspect-video w-full rounded-xl bg-neutral-200 dark:bg-neutral-800" />

      {/* meta bar: date, read time, views */}
      <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border border-neutral-200 bg-neutral-100 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center gap-2">
          <Bar className="h-4 w-4 rounded-full" />
          <Bar className="h-4 w-28 bg-neutral-300 dark:bg-neutral-700" />
        </div>
        <div className="flex items-center gap-2">
          <Bar className="h-4 w-4 rounded-full" />
          <Bar className="h-4 w-20 bg-neutral-300 dark:bg-neutral-700" />
        </div>
        <div className="flex items-center gap-2">
          <Bar className="h-4 w-4 rounded-full" />
          <Bar className="h-4 w-16 bg-neutral-300 dark:bg-neutral-700" />
        </div>
      </div>

      {/* title */}
      <div className="mb-8 space-y-3">
        <Bar className="h-8 w-4/5" />
        <Bar className="h-8 w-2/5" />
      </div>

      {/* body */}
      <div className="space-y-3">
        <Bar className="h-4 w-full" />
        <Bar className="h-4 w-full" />
        <Bar className="h-4 w-11/12" />
        <Bar className="h-4 w-full" />
        <Bar className="h-4 w-4/5" />
        <div className="h-4" />
        <Bar className="h-4 w-full" />
        <Bar className="h-4 w-10/12" />
        <Bar className="h-4 w-full" />
        <Bar className="h-4 w-3/5" />
      </div>
    </section>
  );
}
