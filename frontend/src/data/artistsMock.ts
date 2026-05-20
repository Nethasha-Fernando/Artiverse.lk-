import type { ArtistListItem, ArtistProfile } from "../types/artistProfile";

const ABOUT_PLACEHOLDER =
  "From they fine john he give of rich he. They age and draw mrs like. Improving end distrusts may instantly was household applauded incommode. Why kept very ever home mrs. Considered sympathize ten uncommonly occasional assistance sufficient not.";

const ARTWORK_IMAGES = [
  "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1515405295571-53e8e4e4b9fb?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1561214115-f2f6951a4e4f?auto=format&fit=crop&w=400&q=80",
];

function buildArtworks(prefix: string, count: number) {
  return Array.from({ length: Math.min(count, 6) }, (_, i) => ({
    id: `${prefix}-art-${i + 1}`,
    title: `${prefix} Piece ${i + 1}`,
    image: ARTWORK_IMAGES[i % ARTWORK_IMAGES.length],
  }));
}

export const artistProfiles: ArtistProfile[] = [
  {
    id: "1",
    slug: "melissa-peters",
    name: "Melissa Peters",
    city: "Colombo",
    country: "Sri Lanka",
    profileImage:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80",
    followers: 12900,
    likes: 12100,
    artworksCount: 128,
    dateJoined: "January 28, 2018",
    activeSince: "January 28, 2018",
    website: "https://melissapeters.art",
    personalLinks: [
      { label: "Portfolio", url: "https://melissapeters.art/portfolio" },
      { label: "Behance", url: "https://behance.net/melissapeters" },
    ],
    about: ABOUT_PLACEHOLDER,
    tags: ["Acrylic", "Oil paint", "Spray Paint"],
    socialLinks: {
      facebook: "#",
      instagram: "#",
      tiktok: "#",
      youtube: "#",
    },
    upcomingEvents: [
      {
        id: "e1",
        title: "Colombo Contemporary Showcase",
        date: "June 14, 2026",
        location: "Gallery Cafe, Colombo",
      },
      {
        id: "e2",
        title: "Urban Canvas Live Painting",
        date: "July 3, 2026",
        location: "Independence Square",
      },
    ],
    events: [
      {
        id: "e1",
        title: "Colombo Contemporary Showcase",
        date: "June 14, 2026",
        location: "Gallery Cafe, Colombo",
      },
      {
        id: "e2",
        title: "Urban Canvas Live Painting",
        date: "July 3, 2026",
        location: "Independence Square",
      },
      {
        id: "e3",
        title: "Kandy Art Week Exhibition",
        date: "March 8, 2025",
        location: "Kandy City Centre",
      },
    ],
    artworks: buildArtworks("melissa", 128),
    verified: true,
  },
  {
    id: "2",
    slug: "noah-bennett",
    name: "Noah Bennett",
    city: "Kandy",
    country: "Sri Lanka",
    profileImage:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80",
    followers: 10400,
    likes: 9800,
    artworksCount: 96,
    dateJoined: "March 12, 2019",
    activeSince: "March 12, 2019",
    website: "https://noahbennett.studio",
    personalLinks: [{ label: "Print Shop", url: "https://noahbennett.studio/prints" }],
    about: ABOUT_PLACEHOLDER,
    tags: ["Watercolor", "Ink", "Charcoal"],
    socialLinks: {
      facebook: "#",
      instagram: "#",
      youtube: "#",
    },
    upcomingEvents: [
      {
        id: "e4",
        title: "Hill Country Open Studio",
        date: "May 22, 2026",
        location: "Kandy",
      },
    ],
    events: [
      {
        id: "e4",
        title: "Hill Country Open Studio",
        date: "May 22, 2026",
        location: "Kandy",
      },
      {
        id: "e5",
        title: "Ink & Watercolor Workshop",
        date: "January 10, 2025",
        location: "Online",
      },
    ],
    artworks: buildArtworks("noah", 96),
    verified: true,
  },
  {
    id: "3",
    slug: "ava-martinez",
    name: "Ava Martinez",
    city: "Galle",
    country: "Sri Lanka",
    profileImage:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
    followers: 11800,
    likes: 10900,
    artworksCount: 74,
    dateJoined: "July 5, 2020",
    activeSince: "July 5, 2020",
    personalLinks: [{ label: "Blog", url: "https://avamartinez.blog" }],
    about: ABOUT_PLACEHOLDER,
    tags: ["Acrylic", "Mixed media"],
    socialLinks: {
      instagram: "#",
      tiktok: "#",
    },
    upcomingEvents: [],
    events: [
      {
        id: "e6",
        title: "Galle Fort Art Walk",
        date: "December 2, 2024",
        location: "Galle Fort",
      },
    ],
    artworks: buildArtworks("ava", 74),
  },
  {
    id: "4",
    slug: "leo-carter",
    name: "Leo Carter",
    city: "Negombo",
    country: "Sri Lanka",
    profileImage:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1600&q=80",
    followers: 13200,
    likes: 12500,
    artworksCount: 142,
    dateJoined: "November 2, 2017",
    activeSince: "November 2, 2017",
    website: "https://leocarter.com",
    personalLinks: [
      { label: "Commissions", url: "https://leocarter.com/commissions" },
    ],
    about: ABOUT_PLACEHOLDER,
    tags: ["Oil paint", "Pastel"],
    socialLinks: {
      facebook: "#",
      instagram: "#",
      youtube: "#",
    },
    upcomingEvents: [
      {
        id: "e7",
        title: "Sunset Landscapes Solo Show",
        date: "August 19, 2026",
        location: "Negombo Beach Park",
      },
    ],
    events: [
      {
        id: "e7",
        title: "Sunset Landscapes Solo Show",
        date: "August 19, 2026",
        location: "Negombo Beach Park",
      },
    ],
    artworks: buildArtworks("leo", 142),
    verified: true,
  },
];

export function toArtistListItem(profile: ArtistProfile): ArtistListItem {
  return {
    id: profile.id,
    slug: profile.slug,
    name: profile.name,
    profileImage: profile.profileImage,
    coverImage: profile.coverImage,
    followers: profile.followers,
    likes: profile.likes,
  };
}

export function getArtistListItems(): ArtistListItem[] {
  return artistProfiles.map(toArtistListItem);
}

export function getArtistProfileByIdOrSlug(
  idOrSlug: string,
): ArtistProfile | undefined {
  return artistProfiles.find(
    (artist) => artist.id === idOrSlug || artist.slug === idOrSlug,
  );
}
