import Image from "next/image";
export function PostImage({
  header_Image_UrL,
  title,
  className = "",
}: {
  header_Image_UrL?: string;
  title: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-linear-to-br from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-700 ${className}`}>
      {header_Image_UrL && (
        <Image
          src={header_Image_UrL}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
    </div>
  );
}
