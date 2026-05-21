import { useState, useEffect } from "react";
import type { FullArtwork, Frame, DetailPrint, ArtworkApiResponse, ApiFrameOption, ApiPrint } from "../shared/types/artworkDetail";
import type { DetailPrintSize } from "../shared/types/artworkDetail";

function roundLkr(n: unknown): number {
  const v = Number(n);
  return Number.isFinite(v) ? Math.round(v) : 0;
}

export function getOrientation(width: number, height: number): string {
  if (width > height) return "Landscape";
  if (height > width) return "Portrait";
  return "Square";
}

function mapApiResponse(data: ArtworkApiResponse): FullArtwork {
  const mappedFrames: Frame[] = (data.frameOptions ?? []).map((f) => ({
    id:            `${f.material ?? ""}-${f.color ?? ""}-${f.widthCm ?? 0}`,
    material:      f.material ?? "",
    color:         f.color ?? "",
    widthCm:       roundLkr(f.widthCm),
    extraPriceLkr: f.extraPriceLkr != null ? roundLkr(f.extraPriceLkr) : null,
  }));

  const mappedPrints: DetailPrint[] = (data.prints ?? []).map((p, pi) => ({
    id:              pi,
    surfaceMaterial: p.surfaceMaterial ?? "",
    sizes: (p.sizes ?? []).map((s) => ({
      width:  roundLkr(s.width),
      height: roundLkr(s.height),
      price:  roundLkr(s.price),
    })),
  }));

  return {
    id:          data._id,
    slug:        data.name.toLowerCase().replace(/\s+/g, "-"),
    imageURL:    data.mainImageUrl,
    images:      [data.mainImageUrl, ...(data.supportingImageUrls ?? [])],
    title:       data.name,
    artistName:  data.artistName ?? "Unknown",
    category:    data.category ?? "",
    medium:      data.originalArt?.surfaceMaterial ?? "",
    size:        `${data.originalArt?.widthCm ?? "?"} x ${data.originalArt?.heightCm ?? "?"}`,
    price:       roundLkr(data.originalArt?.priceLkr),
    likes:       0,
    description: data.description ?? "",
    frameDetails: data.originalArt?.isFramed
      ? "This artwork comes framed."
      : "This artwork is not framed.",
    prints:         mappedPrints,
    frames:         mappedFrames,
    originalArtRaw: {
      widthCm:  roundLkr(data.originalArt?.widthCm),
      heightCm: roundLkr(data.originalArt?.heightCm),
    },
  };
}

export function useArtworkDetail(id: string | undefined) {
  const [artwork,  setArtwork]  = useState<FullArtwork | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [edition,           setEdition]           = useState<"original" | "prints">("original");
  const [selectedPrint,     setSelectedPrint]     = useState<DetailPrint | null>(null);
  const [selectedPrintSize, setSelectedPrintSize] = useState<DetailPrintSize | null>(null);
  const [selectedPrintKey,  setSelectedPrintKey]  = useState<string | null>(null);
  const [addFrame,          setAddFrame]          = useState(false);
  const [selectedFrame,     setSelectedFrame]     = useState<Frame | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    fetch(`/api/artworks/${id}`)
      .then((r) => r.json())
      .then((data: ArtworkApiResponse) => {
        if (data.error) { setNotFound(true); return; }

        const mapped = mapApiResponse(data);
        setArtwork(mapped);

        if (mapped.prints && mapped.prints.length > 0) {
          const firstPrint = mapped.prints[0];
          setSelectedPrint(firstPrint);
          if (firstPrint.sizes.length > 0) {
            const firstSize = firstPrint.sizes[0];
            setSelectedPrintSize(firstSize);
            setSelectedPrintKey(`${firstPrint.surfaceMaterial}-${firstSize.width}x${firstSize.height}`);
          }
        }

        if (mapped.frames && mapped.frames.length > 0) {
          setSelectedFrame(mapped.frames[0]);
          setAddFrame(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const getFramePrice = (frame: Frame | null): number => frame?.extraPriceLkr ?? 0;

  const basePrice  = edition === "original" ? artwork?.price ?? 0 : selectedPrintSize?.price ?? 0;
  const framePrice = addFrame && selectedFrame ? getFramePrice(selectedFrame) : 0;
  const total      = basePrice + framePrice;

  const currentMaterial =
    edition === "original"
      ? artwork?.medium ?? ""
      : selectedPrint?.surfaceMaterial ?? artwork?.prints?.[0]?.surfaceMaterial ?? "";

  const currentSize =
    edition === "original"
      ? artwork?.size ?? ""
      : selectedPrintSize
      ? `${selectedPrintSize.width} x ${selectedPrintSize.height} cm`
      : "";

  const orientation: string | null = (() => {
    if (edition === "original") {
      const w = artwork?.originalArtRaw?.widthCm  ?? 0;
      const h = artwork?.originalArtRaw?.heightCm ?? 0;
      return w > 0 && h > 0 ? getOrientation(w, h) : null;
    }
    if (selectedPrintSize) return getOrientation(selectedPrintSize.width, selectedPrintSize.height);
    return null;
  })();

  const selectPrint = (print: DetailPrint, size: DetailPrintSize) => {
    setSelectedPrint(print);
    setSelectedPrintSize(size);
    setSelectedPrintKey(`${print.surfaceMaterial}-${size.width}x${size.height}`);
  };

  return {
    artwork,
    loading,
    notFound,
    edition,
    setEdition,
    selectedPrint,
    selectedPrintSize,
    selectedPrintKey,
    selectPrint,
    addFrame,
    setAddFrame,
    selectedFrame,
    setSelectedFrame,
    getFramePrice,
    basePrice,
    framePrice,
    total,
    currentMaterial,
    currentSize,
    orientation,
  };
}