import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ArtworkCard from "./ArtworkCard";
import ArtworkGrid from "./ArtworkGrid";
import ToggleTabs from "./toggleTabs";
import type { Artwork } from "./types";
import { ALL_CATEGORY_LABEL, CATEGORY_GRID_ITEMS } from "../../constants/artCategories";
import { mapArtworkFromApi } from "../../utils/mapArtwork";

function Gallery() {
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
        if (!Array.isArray(data)) {
          setArtworks([]);
          return;
        }
        setArtworks(data.map(mapArtworkFromApi));
      })
      .catch(() => setArtworks([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchArtworks();
  }, [selectedCategory]);

  const handleCategorySelect = (label: string) => {
    if (label === ALL_CATEGORY_LABEL) {
      setSelectedCategory(null);
      return;
    }
    setSelectedCategory((prev) => (prev === label ? null : label));
  };

  const activeGridLabel = selectedCategory ?? ALL_CATEGORY_LABEL;

  const filteredArtworks = useMemo(() => {
    if (!selectedCategory) return artworks;
    return artworks.filter(
      (a) => a.category?.toLowerCase() === selectedCategory.toLowerCase(),
    );
  }, [artworks, selectedCategory]);

  const handleDelete = async (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Delete this artwork?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/artworks/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchArtworks();
    } catch (err: unknown) {
      alert(
        "Error deleting: " +
          (err instanceof Error ? err.message : "Unknown error"),
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1600px] mx-auto px-6 pt-6 flex items-center justify-between">
        <ToggleTabs
          options={[
            { value: "arts", label: "Arts" },
            { value: "artists", label: "Artists" },
          ]}
          value={tab}
          onChange={(value) => setTab(value as "arts" | "artists")}
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
          <div className="mt-2 mb-4">
            <ArtworkGrid
              grid={CATEGORY_GRID_ITEMS}
              selectedLabel={activeGridLabel}
              onSelect={handleCategorySelect}
            />
            {selectedCategory ? (
              <p className="text-center text-sm text-gray-500 mt-2">
                Showing <span className="font-semibold text-red-500">{selectedCategory}</span> artworks.{" "}
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className="text-red-400 hover:underline"
                >
                  Show all
                </button>
              </p>
            ) : (
              <p className="text-center text-sm text-gray-500 mt-2">
                Showing <span className="font-semibold text-red-500">all</span> artworks
              </p>
            )}
          </div>

          <section className="max-w-[1600px] mx-auto px-6 pb-12">
            {loading ? (
              <p className="text-center text-gray-400 animate-pulse py-20">
                Loading…
              </p>
            ) : filteredArtworks.length === 0 ? (
              <div className="text-center py-24 text-gray-400 space-y-3">
                <p className="text-4xl">🎨</p>
                <p className="text-sm">
                  {selectedCategory
                    ? `No ${selectedCategory} artworks yet.`
                    : "No artworks yet."}
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/artworks/create")}
                  className="mt-2 px-5 py-2 rounded-full bg-[#FF5C5C] text-white text-sm hover:bg-[#F54E4E] transition shadow-[0_6px_16px_rgba(255,92,92,0.16)] border border-[#FF5C5C]/20"
                >
                  Create your first artwork
                </button>
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {filteredArtworks.map((a) => (
                  <div key={a.id} className="relative group max-w-[255px]">
                    <ArtworkCard artwork={a} />
                    <button
                      type="button"
                      onClick={(e) => handleDelete(a.id, e)}
                      className="absolute top-2 left-2 z-10
                      opacity-0 group-hover:opacity-100 transition-all duration-200
                      bg-red-500 hover:bg-red-600 text-white text-xs font-medium
                      px-3 py-1.5 rounded-full shadow-md flex items-center gap-1"
                    >
                      🗑 Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
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

export default Gallery;
