export const ALL_CATEGORY_LABEL = "All";

export const ART_CATEGORIES = [
  "Gouache",
  "Watercolor",
  "Oil",
  "Tempera",
  "Acrylic",
  "Charcoal",
  "Pencil",
  "Ink",
] as const;

export type ArtCategory = (typeof ART_CATEGORIES)[number];

/** Hero-style image used on category carousel cards */
const CATEGORY_IMAGE = "/oil paiting.jpg";

export const CATEGORY_GRID_ITEMS = [
  { label: ALL_CATEGORY_LABEL, image: CATEGORY_IMAGE },
  ...ART_CATEGORIES.map((label) => ({
    label,
    image: CATEGORY_IMAGE,
  })),
];

/** Same artwork photo as the landing page hero */
export const AUTH_PAGE_BG =
  "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1400&auto=format&fit=crop";
