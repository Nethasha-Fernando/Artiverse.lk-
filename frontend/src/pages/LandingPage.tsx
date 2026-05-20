// src/pages/LandingPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ArtworkCard from "../components/artwork/ArtworkCard";
import ToggleTabs  from "../components/artwork/toggleTabs";
import type { Artwork } from "../components/artwork/types";
import { mapArtworkFromApi } from "../utils/mapArtwork";

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const navigate = useNavigate();

  return (
    <div className="px-8 pt-2 pb-0">
      <div className="relative w-full h-[660px] overflow-hidden rounded-2xl">
        <img
          src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1400&auto=format&fit=crop"
          alt="Artist workspace"
          className="w-full h-full object-cover"
        />
        {/* Dark-left gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-14">
          <h1 className="text-white font-bold text-4xl md:text-5xl leading-tight max-w-sm">
            Step into a world painted by imagination
          </h1>
          <p className="text-white/80 text-sm mt-4 max-w-[220px] leading-relaxed">
            We bring creativity from the artist's hands to your home
          </p>
          <div className="mt-8 space-y-2">
            <p className="text-white/75 text-sm">Ready to showcase your creations?</p>
            <button
              onClick={() => navigate("/register")}
              className="px-6 py-2.5 rounded-full bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition shadow-lg"
            >
              Become an artist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Explore Section ──────────────────────────────────────────────────────────

function ExploreSection() {
  const navigate                = useNavigate();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading]   = useState(true);
  const [tab, setTab]           = useState<"arts" | "artists">("arts");

  useEffect(() => {
    fetch("/api/artworks")
      .then((r) => r.json())
      .then((data: unknown) => {
        if (!Array.isArray(data)) {
          setArtworks([]);
          return;
        }
        setArtworks(data.slice(0, 8).map(mapArtworkFromApi));
      })
      .catch(() => setArtworks([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="px-8 py-10">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-red-500">Explore creativity</h2>
        <p className="text-gray-400 text-sm mt-1">
          Find the art that speaks to you and the mind behind it
        </p>
      </div>

      {/* Tabs — ToggleTabs already has my-4 inside, mb-6 adds extra gap before cards */}
      <ToggleTabs
        options={[
          { value: "arts",    label: "Arts" },
          { value: "artists", label: "Artists" },
        ]}
        value={tab}
        onChange={(v) => setTab(v as "arts" | "artists")}
        className="mb-6"
      />

      {/* Arts grid */}
      {tab === "arts" && (
        <>
          {loading ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-[265px] max-w-[255px] bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : artworks.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-4xl mb-3">🎨</p>
              <p className="text-sm">No artworks yet.</p>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {artworks.map((a) => (
                <div key={a.id} className="max-w-[255px]">
                  <ArtworkCard artwork={a} />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === "artists" && (
        <div className="text-center py-20 text-gray-400 text-sm">
          🎨 Artist view coming soon…
        </div>
      )}

      {/* Explore button — goes to /artworks gallery */}
      <div className="flex justify-center mt-10">
        <button
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <ExploreSection />
    </div>
  );
}