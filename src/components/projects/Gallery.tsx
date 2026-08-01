import Image from "next/image";
import type { GalleryImage } from "@/types/project";

export function Gallery({ images }: { images: GalleryImage[] }) {
  if (images.length === 0) return null;

  return (
    <section className="mt-14">
      <h2 className="mb-5 text-xl font-semibold tracking-tight">Галерея</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {images.map((image) => (
          <figure
            key={image.src}
            className="border-border bg-surface overflow-hidden rounded-lg border"
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={1200}
              height={750}
              sizes="(max-width: 640px) 100vw, 50vw"
              className="h-auto w-full object-cover"
            />
            {image.alt && (
              <figcaption className="text-muted px-4 py-3 text-xs">
                {image.alt}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}
