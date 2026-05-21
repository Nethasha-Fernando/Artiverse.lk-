import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ArtworkList from "../components/artwork/ArtworkList";
import { useDeleteArtwork } from "../hooks/useDeleteArtwork";
import type { Artwork } from "../shared/types/types";
import { mapArtworkFromApi } from "../shared/utils/mapArtwork";
import ToggleTabs from "../components/common/ToggleTabs";
import ArtworkGrid from "../components/artwork/ArtworkGrid";
import {
  ALL_CATEGORY_LABEL,
  CATEGORY_GRID_ITEMS,
} from "../shared/constants/artCategories";

export default function ArtworkExplorePage() {
  const [tab, setTab] = useState<"arts" | "artists">("arts");
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchArtworks = () => {
    setLoading(true);
    const url = selectedCategory
      ? `/api/artworks?category=${encodeURIComponent(selectedCategory)}`
      : "/api/artworks";

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setArtworks(Array.isArray(data) ? data.map(mapArtworkFromApi) : []);
      })
      .catch(() => setArtworks([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchArtworks();
  }, [selectedCategory]);

  const handleDelete = useDeleteArtwork(fetchArtworks);

  const handleCategorySelect = (label: string) => {
    if (label === ALL_CATEGORY_LABEL) {
      setSelectedCategory(null);
      return;
    }
    setSelectedCategory((prev) => (prev === label ? null : label));
  };

  const filteredArtworks = useMemo(() => {
    if (!artworks) return [];
    if (!selectedCategory) return artworks;
    return artworks.filter(
      (a) => a.category?.toLowerCase() === selectedCategory.toLowerCase(),
    );
  }, [artworks, selectedCategory]);

  const activeGridLabel = selectedCategory ?? ALL_CATEGORY_LABEL;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="max-w-[1600px] mx-auto px-6 pt-6 flex items-center justify-between">
        <ToggleTabs
          options={[
            { value: "arts", label: "Arts" },
            { value: "artists", label: "Artists" },
          ]}
          value={tab}
          onChange={(v) => setTab(v as "arts" | "artists")}
        />
        <button
          type="button"
          onClick={() => navigate("/artworks/create")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF5C5C] text-white text-sm font-semibold hover:bg-[#F54E4E] active:scale-95 transition-all shadow-[0_10px_30px_rgba(255,92,92,0.18)] border border-[#FF5C5C]/20 whitespace-nowrap"
        >
          ＋ Create Artwork
        </button>
      </div>

      {tab === "arts" && (
        <>
          {/* Category carousel */}
          <div className="mt-2 mb-4">
            <ArtworkGrid
              grid={CATEGORY_GRID_ITEMS}
              selectedLabel={activeGridLabel}
              onSelect={handleCategorySelect}
            />
            <p className="text-center text-sm text-gray-500 mt-2">
              {selectedCategory ? (
                <>
                  Showing{" "}
                  <span className="font-semibold text-red-500">
                    {selectedCategory}
                  </span>{" "}
                  artworks.{" "}
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(null)}
                    className="text-red-400 hover:underline"
                  >
                    Show all
                  </button>
                </>
              ) : (
                <>
                  Showing{" "}
                  <span className="font-semibold text-red-500">all</span>{" "}
                  artworks
                </>
              )}
            </p>
          </div>

          {/* Gallery */}
          <section className="max-w-[1600px] mx-auto px-6 pb-12">
            <ArtworkList
              artworks={filteredArtworks}
              loading={loading}
              selectedCategory={selectedCategory}
              onDelete={handleDelete}
              onCreateClick={() => navigate("/artworks/create")}
            />
          </section>
        </>
      )}

      {tab === "artists" && (
        <div className="text-center text-gray-400 py-24 text-sm">
          🎨 Artist view coming soon…
        </div>
      )}
    </div>
  );
}