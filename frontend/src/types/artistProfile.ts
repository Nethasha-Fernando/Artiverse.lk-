export interface ArtistSocialLinks {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
}

export interface ArtistPersonalLink {
  label: string;
  url: string;
}

export interface ArtistUpcomingEvent {
  id: string;
  title: string;
  date: string;
  location?: string;
}

export interface ArtistArtworkPreview {
  id: string;
  title: string;
  image: string;
}

export type ArtistProfileTab = "overview" | "arts" | "events";

export interface ArtistProfile {
  id: string;
  slug: string;
  name: string;
  city: string;
  country: string;
  profileImage: string;
  coverImage: string;
  followers: number;
  likes: number;
  artworksCount: number;
  dateJoined: string;
  activeSince: string;
  website?: string;
  personalLinks?: ArtistPersonalLink[];
  about: string;
  tags: string[];
  socialLinks: ArtistSocialLinks;
  upcomingEvents: ArtistUpcomingEvent[];
  events: ArtistUpcomingEvent[];
  artworks: ArtistArtworkPreview[];
  verified?: boolean;
}

/** Minimal fields used on the artists listing cards */
export interface ArtistListItem {
  id: string;
  slug: string;
  name: string;
  profileImage: string;
  coverImage: string;
  followers: number;
  likes: number;
}
