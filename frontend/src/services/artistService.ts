import { getArtistProfileByIdOrSlug } from "../data/artistsMock";
import type { ArtistProfile } from "../types/artistProfile";

export class ArtistNotFoundError extends Error {
  constructor(idOrSlug: string) {
    super(`Artist not found: ${idOrSlug}`);
    this.name = "ArtistNotFoundError";
  }
}

/**
 * Fetches a single artist profile.
 * Replace the mock implementation with:
 *   const res = await fetch(`/api/artists/${idOrSlug}`);
 *   if (!res.ok) throw ...
 *   return res.json();
 */
export async function fetchArtistProfile(
  idOrSlug: string,
): Promise<ArtistProfile> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const artist = getArtistProfileByIdOrSlug(idOrSlug);
  if (!artist) {
    throw new ArtistNotFoundError(idOrSlug);
  }

  return artist;
}
