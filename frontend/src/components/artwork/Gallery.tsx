import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ArtworkCard from "./ArtworkCard";
import ToggleTabs from "./toggleTabs";
import type { Artwork } from "./types";

function Gallery() {
  const [tab, setTab] = useState<"arts" | "artists">("arts");
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchArtworks = () => {
    setLoading(true);
    fetch("http://localhost:4000/api/artworks")
      .then((r) => r.json())
      .then((data) => {
        const mapped: Artwork[] = data.map((item: any) => ({
          id: item._id,
          slug: item.name.toLowerCase().replace(/\s+/g, "-"),
          imageURL: item.mainImageUrl,
          title: item.name,
          artistName: "Unknown",
          medium: item.originalArt?.surfaceMaterial ?? "",
          price: item.originalArt?.priceLkr ?? 0,
          likes: 0,
        }));
        setArtworks(mapped);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchArtworks();
  }, []);

  const handleDelete = async (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Delete this artwork?")) return;
    try {
      const res = await fetch(`http://localhost:4000/api/artworks/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchArtworks();
    } catch (err: any) {
      alert("Error deleting: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Top bar ── */}
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
          onClick={() => navigate("/artworks/create")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF5C5C] text-white text-sm font-semibold hover:bg-[#F54E4E] active:scale-95 transition-all shadow-[0_10px_30px_rgba(255,92,92,0.18)] border border-[#FF5C5C]/20 whitespace-nowrap"
        >
          ＋ Create Artwork
        </button>
      </div>

      {/* ── Arts grid ── */}
      {tab === "arts" && (
        <section className="max-w-[1600px] mx-auto px-6 pb-12">
          {loading ? (
            <p className="text-center text-gray-400 animate-pulse py-20">
              Loading…
            </p>
          ) : artworks.length === 0 ? (
            <div className="text-center py-24 text-gray-400 space-y-3">
              <p className="text-4xl">🎨</p>
              <p className="text-sm">No artworks yet.</p>
              <button
                onClick={() => navigate("/artworks/create")}
                className="mt-2 px-5 py-2 rounded-full bg-[#FF5C5C] text-white text-sm hover:bg-[#F54E4E] transition shadow-[0_6px_16px_rgba(255,92,92,0.16)] border border-[#FF5C5C]/20"
              >
                Create your first artwork
              </button>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {artworks.map((a) => (
                <div key={a.id} className="relative group max-w-[255px]">
                  <ArtworkCard artwork={a} />
                  <button
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
