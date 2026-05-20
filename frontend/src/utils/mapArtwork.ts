import type { Artwork } from "../components/artwork/types";

export function mapArtworkFromApi(item: {
  _id: string;
  name: string;
  category?: string;
  mainImageUrl: string;
  originalArt?: { surfaceMaterial?: string; priceLkr?: number };
  artistName?: string;
}): Artwork {
  return {
    id: item._id,
    slug: item.name.toLowerCase().replace(/\s+/g, "-"),
    imageURL: item.mainImageUrl,
    title: item.name,
    artistName: item.artistName ?? "Unknown",
    category: item.category ?? "",
    medium: item.originalArt?.surfaceMaterial ?? "",
    price: Math.round(Number(item.originalArt?.priceLkr) || 0),
    likes: 0,
  };
}
