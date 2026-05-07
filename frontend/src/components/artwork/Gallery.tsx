import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ArtworkCard from "./ArtworkCard";
import ToggleTabs from "./ToggleTabs";
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
    e.stopPropagation(); // don't navigate to detail page
    if (!window.confirm("Delete this artwork?")) return;

    try {
      const res = await fetch(`http://localhost:4000/api/artworks/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchArtworks(); // refresh the list
    } catch (err: any) {
      alert("Error deleting: " + err.message);
    }
  };

  return (
    <>
      {/* Top bar: toggle + create button */}
      <div className="flex items-center justify-between px-6 mt-4">
        <ToggleTabs
          options={[
            { value: "arts", label: "Arts" },
            { value: "artists", label: "Artists" },
          ]}
          value={tab}
          onChange={(value) => setTab(value as "arts" | "artists")}
          className="ml-[208px]"
        />

        {/* ── Create Artwork Button ── */}
        <button
          onClick={() => navigate("/artworks/create")}
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition shadow-md"
        >
          ＋ Create Artwork
        </button>
      </div>

      {tab === "arts" && (
        <section className="px-6 py-12">
          {loading ? (
            <p className="text-center text-gray-400 animate-pulse">Loading...</p>
          ) : artworks.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-4xl mb-3">🎨</p>
              <p>No artworks yet.</p>
              <button
                onClick={() => navigate("/artworks/create")}
                className="mt-4 px-5 py-2 rounded-full bg-red-500 text-white text-sm hover:bg-red-600 transition"
              >
                Create your first artwork
              </button>
            </div>
          ) : (
            <div className="max-w-[1600px] mx-auto grid gap-7 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {artworks.map((a) => (
                <div key={a.id} className="relative group">
                  <ArtworkCard artwork={a} />

                  {/* ── Delete Button (shows on hover) ── */}
                  <button
                    onClick={(e) => handleDelete(a.id, e)}
                    className="absolute top-2 left-2 z-10
                      opacity-0 group-hover:opacity-100 transition
                      bg-red-500 hover:bg-red-600 text-white text-xs
                      px-2 py-1 rounded-full shadow"
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
        <div className="text-center text-gray-600 py-20">
          <p>🎨 Artist view coming soon...</p>
        </div>
      )}
    </>
  );
}

export default Gallery;
