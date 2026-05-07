// src/services/artwork.service.ts
import Artwork from "../models/artwork.model";

export async function listArtworksService() { //all artworkcard details
  return Artwork.find({ name: { $exists: true, $ne: null } })
    .select({
      _id: 1,
      name: 1,
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