import { useEffect, useState } from "react";

type Props = {
  images: string[];
  title?: string;
};

export default function ImageGallery({ images, title }: Props) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (active > images.length - 1) setActive(0);
  }, [images, active]);

  if (!images.length) {
    return <p className="text-sm text-gray-500">No image available.</p>;
  }

  return (
    <div className="grid gap-4 grid-cols-[1fr_90px]">
      {/* Main image */}
      <div>
        <img
          loading="lazy"
          src={images[active]}
          alt={title ?? ""}
          className="w-full max-h-[560px] object-cover rounded-xl border"
        />
        {/* "View in room" — coming soon
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            className="px-4 py-1 rounded-full border border-rose-400 text-rose-600 hover:bg-rose-50 transition"
          >
            View in room
          </button>
        </div>
        */}
      </div>

      {/* Thumbnail rail */}
      <div className="flex flex-col gap-3">
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className={`rounded-xl overflow-hidden border ${
              i === active
                ? "ring-2 ring-rose-400 border-transparent"
                : "border-gray-300"
            }`}
            aria-label={`Thumbnail ${i + 1}`}
          >
            <img src={src} alt="" className="w-full h-24 object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}