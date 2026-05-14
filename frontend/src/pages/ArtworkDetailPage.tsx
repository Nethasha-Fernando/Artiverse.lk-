// ArtworkDetailPage.tsx
import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import type { Artwork } from "../components/artwork/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PrintSize {
  width: number;
  height: number;
  price: number;
}

interface Print {
  id: number;
  surfaceMaterial: string;
  sizes: PrintSize[];
}

interface Frame {
  id: number;
  material: string;
  color: string;
  widthCm: number;
  extraPriceLkr: number | null;
}

interface FullArtwork extends Artwork {
  prints?: Print[];
  frames?: Frame[];
  originalArtRaw?: { widthCm: number; heightCm: number };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getOrientation(width: number, height: number): string {
  if (width > height) return "Landscape";
  if (height > width) return "Portrait";
  return "Square";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="flex gap-3">
      <div className="flex-1 relative rounded-xl overflow-hidden bg-gray-100 aspect-[4/5]">
        <img
          src={images[selected]}
          alt={title}
          className="w-full h-full object-cover"
        />
        <button className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white text-red-500 border border-red-300 text-xs font-medium px-4 py-1.5 rounded-full shadow hover:bg-red-50 transition">
          View in room
        </button>
      </div>
      {images.length > 1 && (
        <div className="flex flex-col gap-2 w-[72px]">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`rounded-lg overflow-hidden border-2 transition aspect-[3/4] ${
                selected === i ? "border-red-400" : "border-transparent"
              }`}
            >
              <img
                src={img}
                alt={`${title} ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ToggleTabs({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex rounded-full border border-red-300 overflow-hidden w-fit">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-5 py-1.5 text-sm font-medium transition ${
            value === opt.value
              ? "bg-red-500 text-white"
              : "text-red-500 bg-white hover:bg-red-50"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── Price Summary ────────────────────────────────────────────────────────────

function PriceSummaryArtwork({
  artPrice,
  framePrice,
}: {
  artPrice: number;
  framePrice: number;
}) {
  const total = artPrice + framePrice;
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden text-sm">
      <div className="px-4 py-3 flex justify-between text-gray-700 border-b border-gray-100">
        <span>Original Art</span>
        <span>LKR {artPrice.toLocaleString("en-LK")}.00</span>
      </div>
      {framePrice > 0 && (
        <div className="px-4 py-3 flex justify-between text-gray-700 border-b border-gray-100">
          <span>Frame</span>
          <span>LKR {framePrice.toLocaleString("en-LK")}.00</span>
        </div>
      )}
      <div className="px-4 py-3 flex justify-end items-center gap-2">
        <span className="font-bold text-gray-900 text-base">
          LKR {total.toLocaleString("en-LK")}.00
        </span>
        <span className="bg-red-500 text-white text-xs font-semibold px-3 py-0.5 rounded-r-full rounded-l-sm">
          Total
        </span>
      </div>
    </div>
  );
}

// ─── Print Card ───────────────────────────────────────────────────────────────

function PrintCard({
  print,
  size,
  isSelected,
  onSelect,
}: {
  print: Print;
  size: PrintSize;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const rows = [
    { label: "Material", value: print.surfaceMaterial },
    { label: "Size", value: `${size.width} x ${size.height} cm` },
    { label: "Price", value: `LKR ${size.price.toLocaleString("en-LK")}.00` },
  ];

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-lg border-2 overflow-hidden transition-all ${
        isSelected
          ? "border-red-400 shadow-sm shadow-red-100"
          : "border-gray-200 hover:border-red-200"
      }`}
    >
      {rows.map((row, i) => (
        <div
          key={row.label}
          className={`flex items-center justify-between px-3 py-1.5 text-xs ${
            i < rows.length - 1 ? "border-b border-gray-100" : ""
          } ${isSelected ? "bg-red-50/60" : "bg-white"}`}
        >
          <span className="font-medium text-gray-500 w-16">{row.label}</span>
          <span
            className={`font-semibold ${
              row.label === "Price" ? "text-red-500" : "text-gray-800"
            }`}
          >
            {row.value}
          </span>
        </div>
      ))}
    </button>
  );
}

// ─── Frame Card ───────────────────────────────────────────────────────────────

function FrameCard({
  frame,
  isSelected,
  onSelect,
  framePrice,
}: {
  frame: Frame;
  isSelected: boolean;
  onSelect: () => void;
  framePrice: number;
}) {
  const rows = [
    { label: "Material", value: frame.material || "—" },
    { label: "Color", value: frame.color || "—" },
    { label: "Width", value: frame.widthCm ? `${frame.widthCm} cm` : "—" },
    { label: "Price", value: `LKR ${framePrice.toLocaleString("en-LK")}.00` },
  ];

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-lg border-2 overflow-hidden transition-all ${
        isSelected
          ? "border-rose-400 shadow-sm shadow-rose-100"
          : "border-gray-200 hover:border-rose-200"
      }`}
    >
      {rows.map((row, i) => (
        <div
          key={row.label}
          className={`flex items-center justify-between px-3 py-1.5 text-xs ${
            i < rows.length - 1 ? "border-b border-gray-100" : ""
          } ${isSelected ? "bg-rose-50/60" : "bg-white"}`}
        >
          <span className="font-medium text-gray-500 w-16">{row.label}</span>
          <span
            className={`font-semibold ${
              row.label === "Price" ? "text-rose-500" : "text-gray-800"
            }`}
          >
            {row.value}
          </span>
        </div>
      ))}
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ArtworkDetailPage() {
  const { id, slug } = useParams<{ id: string; slug?: string }>();

  const [artwork, setArtwork] = useState<FullArtwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [edition, setEdition] = useState<"original" | "prints">("original");

  const [selectedPrint, setSelectedPrint] = useState<Print | null>(null);
  const [selectedPrintSize, setSelectedPrintSize] = useState<PrintSize | null>(null);
  const [selectedPrintKey, setSelectedPrintKey] = useState<string | null>(null);

  const [addFrame, setAddFrame] = useState(true);
  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    fetch(`http://localhost:4000/api/artworks/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setNotFound(true); return; }

        const mappedFrames: Frame[] = (data.frameOptions ?? []).map(
          (f: any, i: number) => ({
            id: i,
            material: f.material ?? "",
            color: f.color ?? "",
            widthCm: typeof f.widthCm === "number" ? f.widthCm : 0,
            extraPriceLkr: typeof f.extraPriceLkr === "number" ? f.extraPriceLkr : null,
          })
        );

        const mapped: FullArtwork = {
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
            : "This artwork is not framed.",
          prints: data.prints ?? [],
          frames: mappedFrames,
          // ← store raw numbers for accurate orientation
          originalArtRaw: {
            widthCm: data.originalArt?.widthCm ?? 0,
            heightCm: data.originalArt?.heightCm ?? 0,
          },
        };

        setArtwork(mapped);

        // Default: first print + first size — use surfaceMaterial-based key
        if (mapped.prints && mapped.prints.length > 0) {
          const firstPrint = mapped.prints[0];
          setSelectedPrint(firstPrint);
          if (firstPrint.sizes.length > 0) {
            const firstSize = firstPrint.sizes[0];
            setSelectedPrintSize(firstSize);
            setSelectedPrintKey(
              `${firstPrint.surfaceMaterial}-${firstSize.width}x${firstSize.height}`
            );
          }
        }

        if (mappedFrames.length > 0) {
          setSelectedFrame(mappedFrames[0]);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  // ─── Price helpers ─────────────────────────────────────────────────────────

  const getCurrentPrice = (): number => {
    if (edition === "original") return artwork?.price ?? 0;
    return selectedPrintSize?.price ?? 0;
  };

  const basePrice = getCurrentPrice();

  const getFramePrice = (frame: Frame | null): number => {
    if (!frame) return 0;
    if (frame.extraPriceLkr !== null && frame.extraPriceLkr > 0) return frame.extraPriceLkr;
    return frame.widthCm * 100;
  };

  const framePrice = addFrame && selectedFrame ? getFramePrice(selectedFrame) : 0;
  const total = basePrice + framePrice;

  // ─── Guards ────────────────────────────────────────────────────────────────

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

  const correctSlug = artwork.title?.toLowerCase().replace(/\s+/g, "-");
  if (slug && correctSlug && slug !== correctSlug) {
    return <Navigate to={`/artworks/${artwork.id}/${correctSlug}`} replace />;
  }

  // ─── Derived display values ────────────────────────────────────────────────

  const currentMaterial =
    edition === "original"
      ? artwork.medium
      : selectedPrint?.surfaceMaterial ?? artwork.prints?.[0]?.surfaceMaterial ?? "";

  const currentSize =
    edition === "original"
      ? artwork.size
      : selectedPrintSize
      ? `${selectedPrintSize.width} x ${selectedPrintSize.height} cm`
      : "";

  const currentPrice =
    edition === "original" ? artwork.price : selectedPrintSize?.price ?? 0;

  // Orientation — computed directly from raw numbers, no string parsing
  const orientation: string | null = (() => {
    if (edition === "original") {
      const w = artwork.originalArtRaw?.widthCm ?? 0;
      const h = artwork.originalArtRaw?.heightCm ?? 0;
      if (w > 0 && h > 0) return getOrientation(w, h);
      return null;
    }
    if (selectedPrintSize) {
      return getOrientation(selectedPrintSize.width, selectedPrintSize.height);
    }
    return null;
  })();

  // ─── Print selector ────────────────────────────────────────────────────────

  const renderPrintSelector = () => {
    if (!artwork.prints || artwork.prints.length === 0) {
      return (
        <p className="text-sm text-gray-500">No print options available for this artwork.</p>
      );
    }

    // Flatten to one card per (print, size) pair
    // Key uses surfaceMaterial + dimensions — never trust DB-assigned id
    const cards: { print: Print; size: PrintSize }[] = artwork.prints.flatMap((print) =>
      print.sizes.map((size) => ({ print, size }))
    );

    return (
      <div className="grid grid-cols-2 gap-2">
        {cards.map(({ print, size }) => {
          const cardKey = `${print.surfaceMaterial}-${size.width}x${size.height}`;
          const isSelected = selectedPrintKey === cardKey;
          return (
            <PrintCard
              key={cardKey}
              print={print}
              size={size}
              isSelected={isSelected}
              onSelect={() => {
                setSelectedPrint(print);
                setSelectedPrintSize(size);
                setSelectedPrintKey(cardKey);
              }}
            />
          );
        })}
      </div>
    );
  };

  // ─── Frame section ────────────────────────────────────────────────────────

  const renderFrameSection = () => {
    return (
      <div className="space-y-2.5">
        <p className="text-sm text-gray-700">
          Would you like to purchase this art with a frame?{" "}
          <span className="text-gray-400 font-normal">Additional charges will apply.</span>
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => setAddFrame(true)}
            className={`px-4 py-1.5 rounded-full border text-xs font-medium transition ${
              addFrame
                ? "bg-rose-400 text-white border-rose-400"
                : "border-gray-300 text-gray-600 hover:border-rose-300 hover:text-rose-400"
            }`}
          >
            Yes, add a frame
          </button>
          <button
            onClick={() => setAddFrame(false)}
            className={`px-4 py-1.5 rounded-full border text-xs font-medium transition ${
              !addFrame
                ? "bg-rose-400 text-white border-rose-400"
                : "border-gray-300 text-gray-600 hover:border-rose-300 hover:text-rose-400"
            }`}
          >
            No, just the art
          </button>
        </div>

        {addFrame && (
          <>
            {!artwork.frames || artwork.frames.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No frame options available for this artwork.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {artwork.frames.map((frame) => (
                  <FrameCard
                    key={frame.id}
                    frame={frame}
                    isSelected={selectedFrame?.id === frame.id}
                    onSelect={() => setSelectedFrame(frame)}
                    framePrice={getFramePrice(frame)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8 grid gap-10 lg:grid-cols-2">

      {/* ── LEFT COLUMN ── */}
      <div className="space-y-6">
        <ImageGallery
          images={artwork.images?.length ? artwork.images : artwork.imageURL ? [artwork.imageURL] : []}
          title={artwork.title}
        />
        {artwork.description && (
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{artwork.description}</p>
          </div>
        )}
      </div>

      {/* ── RIGHT COLUMN ── */}
      <div className="space-y-5">

        {/* Title & artist */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">{artwork.title}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-semibold text-gray-700">By {artwork.artistName}</span>
            <span>•</span>
            <span>Colombo District, Sri Lanka</span>
          </div>
        </div>

        {/* Edition toggle */}
        <ToggleTabs
          options={[
            { value: "original", label: "Original" },
            { value: "prints", label: "Prints" },
          ]}
          value={edition}
          onChange={(v) => setEdition(v as "original" | "prints")}
        />

        {/* Price + attributes */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-red-500 font-bold text-xl">
              LKR {currentPrice.toLocaleString("en-LK")}.00
            </span>
            <span className="bg-red-500 text-white text-xs font-semibold px-3 py-0.5 rounded-r-full rounded-l-sm">
              Price
            </span>
          </div>

          {edition === "original" && (
            <div className="text-sm text-gray-700 space-y-0.5">
              <div className="flex gap-2">
                <span className="text-gray-400 w-24 shrink-0">Material :</span>
                <span className="font-medium text-gray-800">{currentMaterial}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400 w-24 shrink-0">Size :</span>
                <span className="font-medium text-gray-800">{currentSize}</span>
              </div>
              {orientation && (
                <div className="flex gap-2">
                  <span className="text-gray-400 w-24 shrink-0">Orientation :</span>
                  <span className="font-medium text-gray-800">{orientation}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Print selector */}
        {edition === "prints" && renderPrintSelector()}

        {/* Frame section */}
        {renderFrameSection()}

        {/* Price summary */}
        <PriceSummaryArtwork
          artPrice={basePrice}
          framePrice={addFrame ? framePrice : 0}
        />

        {/* Add to cart */}
        <button
          onClick={() => {
            console.log("🛒 Added to cart:", {
              artwork: artwork.title,
              edition,
              printSize: selectedPrintSize,
              frame: addFrame ? selectedFrame : null,
              total,
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