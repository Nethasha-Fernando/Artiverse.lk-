import { useNavigate } from "react-router-dom";
import ArtworkCard from "./ArtworkCard";
import type { Artwork } from "../../shared/types/types";

type Props = {
  artworks:         Artwork[];
  loading:          boolean;
  selectedCategory?: string | null;
  onDelete?:        (id: string | number) => void;
  onCreateClick?:   () => void;
};

export default function ArtworkList({
  artworks = [],
  loading,
  selectedCategory,
  onDelete,
  onCreateClick,
}: Props) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <p className="text-center text-gray-400 animate-pulse py-20">Loading…</p>
    );
  }

  if (artworks.length === 0) {
    return (
      <div className="text-center py-24 text-gray-400 space-y-3">
        <p className="text-4xl">🎨</p>
        <p className="text-sm">
          {selectedCategory
            ? `No ${selectedCategory} artworks yet.`
            : "No artworks yet."}
        </p>
        {onCreateClick && (
          <button
            type="button"
            onClick={onCreateClick}
            className="mt-2 px-5 py-2 rounded-full bg-[#FF5C5C] text-white text-sm
              hover:bg-[#F54E4E] transition shadow-[0_6px_16px_rgba(255,92,92,0.16)]
              border border-[#FF5C5C]/20"
          >
            Create your first artwork
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {artworks.map((a) => (
        <div
          key={String(a.id)}
          className="relative group max-w-[255px] cursor-pointer"
          onClick={() => navigate(`/artworks/${a.id}/${a.slug}`)}
        >
          <ArtworkCard artwork={a} />
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(a.id);
              }}
              className="absolute top-2 left-2 z-10
                opacity-0 group-hover:opacity-100 transition-all duration-200
                bg-red-500 hover:bg-red-600 text-white text-xs font-medium
                px-3 py-1.5 rounded-full shadow-md flex items-center gap-1"
            >
              🗑 Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}