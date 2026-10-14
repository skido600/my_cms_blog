export function PostsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div className="h-96 animate-pulse rounded-2xl bg-neutral-200 md:col-span-2 lg:row-span-2 lg:h-full dark:bg-neutral-800" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-72 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800"
        />
      ))}
    </div>
  );
}
