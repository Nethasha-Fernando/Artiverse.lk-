import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import ImageGallery from "../components/artwork/ImageGallery";
import ArtworkDetails from "../components/artwork/ArtworkDetails";
import FramePicker from "../components/artwork/FramePicker";
import PriceSummaryArtwork from "../components/artwork/PriceSummaryArtwork";
import AddToCart from "../components/artwork/AddToCart";
import ToggleTabs from "../components/artwork/ToggleTabs";
import type { Artwork } from "../components/artwork/types";

export default function ArtworkDetailPage() {
  const { id, slug } = useParams<{ id: string; slug?: string }>();

  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [edition, setEdition] = useState<"original" | "prints">("original");
  const [addFrame, setAddFrame] = useState(true);
  const [framePrice, setFramePrice] = useState(0);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    fetch(`http://localhost:4000/api/artworks/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setNotFound(true);
          return;
        }

        const mapped: Artwork = {
          id: data._id,
          slug: data.name.toLowerCase().replace(/\s+/g, "-"),
          imageURL: data.mainImageUrl,
          images: [data.mainImageUrl, ...(data.supportingImageUrls ?? [])],
          title: data.name,
          artistName: "Unknown",
          medium: data.originalArt?.surfaceMaterial ?? "",
          size: `${data.originalArt?.widthCm ?? "?"} x ${data.originalArt?.heightCm ?? "?"}`,
          price: data.originalArt?.priceLkr ?? 0,
          likes: 0,
          description: data.description ?? "",
          frameDetails: data.originalArt?.isFramed
            ? "This artwork comes framed."
            : "This artwork is not framed. However, we offer customizable frames in various widths and colors to suit your space.",
        };

        setArtwork(mapped);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  // ── Guards ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-gray-400 text-sm animate-pulse">Loading artwork...</p>
      </div>
    );
  }

  if (notFound || !artwork) {
    return <div className="p-6 text-gray-600">Artwork not found.</div>;
  }

  // Optional: canonical slug redirect
  const correctSlug = artwork.title?.toLowerCase().replace(/\s+/g, "-");
  if (slug && correctSlug && slug !== correctSlug) {
    return <Navigate to={`/artworks/${artwork.id}/${correctSlug}`} replace />;
  }

  const total = artwork.price + (addFrame ? framePrice : 0);

  return (
    <div className="max-w-[1200px] mx-auto p-6 grid gap-10 lg:grid-cols-2">

      {/* ── LEFT: gallery + description + frame details ── */}
      <div className="space-y-6">
        <ImageGallery
          images={
            artwork.images?.length
              ? artwork.images
              : artwork.imageURL
                ? [artwork.imageURL]
                : []
          }
          title={artwork.title}
        />

        {artwork.description && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {artwork.description}
            </p>
          </div>
        )}

        {artwork.frameDetails && (
          <div className="mt-6 rounded-xl border p-4 bg-gray-50">
            <h3 className="font-semibold mb-2 text-sm">Frame details</h3>
            <p className="text-sm text-gray-700">{artwork.frameDetails}</p>
          </div>
        )}
      </div>

      {/* ── RIGHT: details + edition + frame picker + price + cart ── */}
      <div className="space-y-6">
        <ArtworkDetails
          title={artwork.title}
          artist={artwork.artistName}
          price={artwork.price}
          material={artwork.medium}
          size={artwork.size ?? ""}
          location="Colombo District, Sri Lanka"
          notFramedNote={
            artwork.frameDetails?.startsWith("This artwork is not framed")
              ? "The art is not framed"
              : undefined
          }
        />

        {/* Edition toggle */}
        <ToggleTabs
          options={[
            { value: "original", label: "Original" },
            { value: "prints", label: "Prints" },
          ]}
          value={edition}
          onChange={(v) => setEdition(v as "original" | "prints")}
        />

        <p className="text-xs text-gray-500">
          {edition === "original"
            ? "You are viewing the one-of-a-kind original artwork."
            : "You are viewing high-quality prints of this artwork."}
        </p>

        {/* Frame toggle */}
        <div>
          <p className="text-sm font-medium">
            Would you like to purchase this art with a frame?
          </p>
          <div className="mt-2 flex gap-3">
            <button
              onClick={() => setAddFrame(true)}
              className={`px-4 py-1 rounded ${
                addFrame ? "bg-red-500 text-white" : "bg-gray-200"
              }`}
            >
              Yes, add a frame
            </button>
            <button
              onClick={() => setAddFrame(false)}
              className={`px-4 py-1 rounded ${
                !addFrame ? "bg-red-500 text-white" : "bg-gray-200"
              }`}
            >
              No, just the art
            </button>
          </div>
        </div>

        {/* Frame picker */}
        {addFrame && (
          <>
            <FramePicker
              onPriceChange={setFramePrice}
              onChange={(sel) => console.log("Frame selection:", sel)}
            />
            <p className="text-xs text-gray-500">
              Frame price: LKR {framePrice.toLocaleString("en-LK")}
            </p>
          </>
        )}

        {/* Price summary + cart */}
        <PriceSummaryArtwork
          artPrice={artwork.price}
          framePrice={addFrame ? framePrice : 0}
        />
        <AddToCart
          total={total}
          onAdd={() => console.log("🛒 Added to cart:", artwork)}
        />
      </div>
    </div>
  );
}