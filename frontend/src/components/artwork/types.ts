export type Artwork = {
  id: number | string;
  slug: string;
  imageURL: string;
  images?: string[];         // ← add if missing
  title: string;
  artistName: string;
  category: string;
  medium: string;
  size?: string;             // ← add if missing
  price: number;
  likes?: number;
  tags?: string[];
  description?: string;      // ← add if missing
  frameDetails?: string;     // ← add if missing
};