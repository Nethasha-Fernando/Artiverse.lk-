import { apiJson, getAuthHeaders, resolveMediaUrl } from "../lib/api";
import type { ArtistListItem, ArtistProfile } from "../types/artistProfile";

export class ArtistNotFoundError extends Error {
  constructor(idOrSlug: string) {
    super(`Artist not found: ${idOrSlug}`);
    this.name = "ArtistNotFoundError";
  }
}

function normalizeProfile(raw: ArtistProfile): ArtistProfile {
  return {
    ...raw,
    id: String(raw.id),
    profileImage: resolveMediaUrl(raw.profileImage),
    coverImage: resolveMediaUrl(raw.coverImage),
    artworks: (raw.artworks || []).map((a) => ({
      ...a,
      image: resolveMediaUrl(a.image),
    })),
  };
}

function normalizeListItem(raw: ArtistListItem): ArtistListItem {
  return {
    ...raw,
    id: String(raw.id),
    profileImage: resolveMediaUrl(raw.profileImage),
    coverImage: resolveMediaUrl(raw.coverImage),
  };
}

export async function fetchArtists(): Promise<ArtistListItem[]> {
  const data = await apiJson<{ artists: ArtistListItem[] }>("/api/artists");
  return (data.artists || []).map(normalizeListItem);
}

export async function fetchArtistProfile(
  idOrSlug: string,
  token?: string | null,
): Promise<ArtistProfile> {
  const isMe = idOrSlug === "me";
  const url = isMe ? "/api/artists/me" : `/api/artists/${idOrSlug}`;

  const res = await fetch(url, {
    headers: getAuthHeaders(isMe ? token : undefined),
  });
  const data = await res.json().catch(() => ({}));

  if (res.status === 404) {
    throw new ArtistNotFoundError(idOrSlug);
  }
  if (!res.ok) {
    throw new Error(
      (data as { error?: string }).error ||
        `Request failed (${res.status})`,
    );
  }

  return normalizeProfile(data as ArtistProfile);
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  country?: string;
  district?: string;
  address?: string;
  postalCode?: string;
  artCategories?: string[];
  aboutArtist?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
    tiktok?: string;
    youtube?: string;
  };
}

export async function updateArtistProfile(
  token: string,
  payload: UpdateProfilePayload,
): Promise<ArtistProfile> {
  const data = await apiJson<{ profile: ArtistProfile }>(
    "/api/artists/update-profile",
    {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    },
  );
  return normalizeProfile(data.profile);
}

export async function uploadProfileImage(
  token: string,
  file: File,
): Promise<string> {
  const form = new FormData();
  form.append("image", file);

  const res = await fetch("/api/artists/upload-profile-image", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return resolveMediaUrl(data.profileImage);
}

export async function uploadBackgroundImage(
  token: string,
  file: File,
): Promise<string> {
  const form = new FormData();
  form.append("image", file);

  const res = await fetch("/api/artists/upload-background-image", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return resolveMediaUrl(data.backgroundImage);
}
