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

export function normalizeCategory(value: string): ArtCategory | null {
  const match = ART_CATEGORIES.find(
    (c) => c.toLowerCase() === value.trim().toLowerCase(),
  );
  return match ?? null;
}
