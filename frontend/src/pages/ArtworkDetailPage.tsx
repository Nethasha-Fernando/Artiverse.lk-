import { useParams, Navigate }  from "react-router-dom";
import { useArtworkDetail }     from "../hooks/useArtworkDetail";
import ImageGallery             from "../components/artwork/detail/ImageGallery";
import ToggleTabs               from "../components/common/ToggleTabs";
import PriceSummary             from "../components/common/PriceSummary";
import PrintSelector            from "../components/artwork/detail/PrintSelector";
import FrameSelector            from "../components/artwork/detail/FrameSelector";
import ArtworkAttributes        from "../components/artwork/detail/ArtworkAttributes";

export default function ArtworkDetailPage() {
  const { id, slug } = useParams<{ id: string; slug?: string }>();
  const detail = useArtworkDetail(id);

  if (detail.loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-gray-400 text-sm animate-pulse">Loading artwork...</p>
      </div>
    );
  }

  if (detail.notFound || !detail.artwork) {
    return <div className="p-6 text-gray-600">Artwork not found.</div>;
  }

  const { artwork } = detail;

  const correctSlug = artwork.title?.toLowerCase().replace(/\s+/g, "-");
  if (slug && correctSlug && slug !== correctSlug) {
    return <Navigate to={`/artworks/${artwork.id}/${correctSlug}`} replace />;
  }

  const galleryImages = artwork.images?.length
    ? artwork.images
    : artwork.imageURL
    ? [artwork.imageURL]
    : [];

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8 grid gap-10 lg:grid-cols-2">

      {/* LEFT COLUMN */}
      <div className="space-y-6">
        <ImageGallery images={galleryImages} title={artwork.title} />
        {artwork.description && (
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{artwork.description}</p>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN */}
      <div className="space-y-5">

        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">{artwork.title}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-semibold text-gray-700">By {artwork.artistName}</span>
            <span>•</span>
            <span>Colombo District, Sri Lanka</span>
          </div>
        </div>

        <ToggleTabs
          options={[
            { value: "original", label: "Original" },
            { value: "prints",   label: "Prints"   },
          ]}
          value={detail.edition}
          onChange={(v) => detail.setEdition(v as "original" | "prints")}
        />

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-red-500 font-bold text-xl">
              LKR {detail.basePrice.toLocaleString("en-LK")}.00
            </span>
            <span className="bg-red-500 text-white text-xs font-semibold px-3 py-0.5 rounded-r-full rounded-l-sm">
              Price
            </span>
          </div>

          {detail.edition === "original" && (
            <ArtworkAttributes
              category={artwork.category}
              material={detail.currentMaterial}
              size={detail.currentSize}
              orientation={detail.orientation}
            />
          )}
        </div>

        {detail.edition === "prints" && (
          <PrintSelector
            prints={artwork.prints ?? []}
            selectedPrintKey={detail.selectedPrintKey}
            onSelect={detail.selectPrint}
          />
        )}

        <FrameSelector
          frames={artwork.frames ?? []}
          addFrame={detail.addFrame}
          selectedFrame={detail.selectedFrame}
          onAddFrame={detail.setAddFrame}
          onSelectFrame={detail.setSelectedFrame}
          getFramePrice={detail.getFramePrice}
        />

        <PriceSummary
          artPrice={detail.basePrice}
          framePrice={detail.addFrame ? detail.framePrice : 0}
          edition={detail.edition}
        />

        <button
          onClick={() => {
            console.log("🛒 Added to cart:", {
              artwork:    artwork.title,
              edition:    detail.edition,
              print:      detail.selectedPrint ?? null,
              printSize:  detail.selectedPrintSize,
              frame:      detail.addFrame ? detail.selectedFrame : null,
              total:      detail.total,
            });
          }}
          className="w-full text-white font-semibold py-3 rounded-full transition text-sm tracking-wide"
          style={{ backgroundColor: "#e8624a" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#d4523b")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#e8624a")}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}