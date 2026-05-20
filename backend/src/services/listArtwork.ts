// src/services/artwork.service.ts
import Artwork from "../models/artwork.model";

export async function listArtworksService(category?: string) {
  const filter: Record<string, unknown> = { name: { $exists: true, $ne: null } };
  if (category) filter.category = category;

  return Artwork.find(filter)
    .select({
      _id: 1,
      name: 1,
      category: 1,
      mainImageUrl: 1,
      originalArt: 1,
      createdAt: 1,
      updatedAt: 1,
    })
    .sort({ createdAt: -1 })
    .lean()
    .exec();
}
 // same thing for artworkdetails