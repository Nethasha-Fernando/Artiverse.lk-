import { useState }           from "react";
import { useNavigate }        from "react-router-dom";
import ToggleTabs             from "../common/ToggleTabs";
import ArtworkList            from "../artwork/ArtworkList";
import { useLandingArtworks } from "../../hooks/useLandingArtworks";

export default function ExploreSection() {
  const navigate              = useNavigate();
  const { artworks, loading } = useLandingArtworks();
  const [tab, setTab]         = useState<"arts" | "artists">("arts");

  return (
    <section className="px-8 py-10">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-red-500">Explore creativity</h2>
        <p className="text-gray-400 text-sm mt-1">
          Find the art that speaks to you and the mind behind it
        </p>
      </div>

      <ToggleTabs
        options={[
          { value: "arts",    label: "Arts"    },
          { value: "artists", label: "Artists" },
        ]}
        value={tab}
        onChange={(v) => setTab(v as "arts" | "artists")}
        className="mb-6"
      />

      {tab === "arts" && (
        <ArtworkList artworks={artworks} loading={loading} />
      )}

      {tab === "artists" && (
        <div className="text-center py-20 text-gray-400 text-sm">
          🎨 Artist view coming soon...
        </div>
      )}

      <div className="flex justify-center mt-10">
        <button
          type="button"
          onClick={() => navigate("/artworks")}
          className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition shadow-md"
        >
          Explore
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}