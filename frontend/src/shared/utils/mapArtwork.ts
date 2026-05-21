import type { Artwork } from "../types/types";

export function mapArtworkFromApi(raw: any): Artwork {
  console.log("raw artwork from API:", raw); // remove after confirming
  return {
    id:         raw._id         ?? raw.id,
    slug:       raw.slug        ?? "",
    imageURL:   raw.mainImageUrl ?? raw.imageURL ?? raw.image_url ?? raw.imageUrl ?? null,
    title:      raw.name        ?? raw.title     ?? "Untitled",
    artistName: raw.artist?.name ?? raw.artistName ?? raw.artist_name ?? "Unknown",
    category:   raw.category,
    price:      Number(raw.originalArt?.priceLkr ?? raw.price ?? 0),
    likes:      Number(raw.likes ?? 0),
  };
}