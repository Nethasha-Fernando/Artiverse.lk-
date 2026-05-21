export const ALL_CATEGORY_LABEL = "All";

export const ART_CATEGORIES = [
  {
    label: "Gouache",
    image: "/categories/gouache.jpg",
  },
  {
    label: "Watercolor",
    image: "/categories/watercolor.jpg",
  },
  {
    label: "Oil",
    image: "/categories/oil.jpg",
  },
  {
    label: "Tempera",
    image: "/categories/tempera.jpg",
  },
  {
    label: "Acrylic",
    image: "/categories/acrylic.jpg",
  },
  {
    label: "Charcoal",
    image: "/categories/charcoal.jpg",
  },
  {
    label: "Pencil",
    image: "/categories/pencil.jpg",
  },
  {
    label: "Ink",
    image: "/categories/ink.jpg",
  },
] as const;

export type ArtCategory = (typeof ART_CATEGORIES)[number]["label"];

export const CATEGORY_GRID_ITEMS = [
  {
    label: ALL_CATEGORY_LABEL,
    image: "/categories/all.jpg",
  },
  ...ART_CATEGORIES,
] as const;