// ─── Artwork (gallery / list card) ───────────────────────────────────────────

export interface Artwork {
  id:         string | number;
  slug:       string;
  imageURL:   string;
  title:      string;
  artistName: string;
  category?:  string;
  price:      number;
  likes?:     number;
}

// ─── Artwork creation form (all strings — form inputs) ────────────────────────

export interface PrintSize {
  width:  string;
  height: string;
  price:  string;
}

export interface Print {
  id:              number;
  surfaceMaterial: string;
  sizes:           PrintSize[];
}

export interface FrameOption {
  id:              number;
  surfaceMaterial: string;
  color:           string;
  widthCm:         string;
  extraPriceLkr:   string;
}

export interface OriginalArt {
  surfaceMaterial: string;
  widthCm:         string;
  heightCm:        string;
  priceLkr:        string;
}

export interface ArtworkForm {
  name:                    string;
  description:             string;
  category:                string;
  mainImageUrl:            string | null;
  supportingImageUrls:     string[];
  originalArt:             OriginalArt;
  offerFramingForOriginal: boolean | null;
  offerFramingForPrints:   boolean | null;
  prints:                  Print[];
  frames:                  FrameOption[];
}

// ─── Artwork detail page (numbers — from API) ─────────────────────────────────

export interface DetailPrintSize {
  width:  number;
  height: number;
  price:  number;
}

export interface DetailPrint {
  id:              number;
  surfaceMaterial: string;
  sizes:           DetailPrintSize[];
}

export interface Frame {
  id:            string;
  material:      string;
  color:         string;
  widthCm:       number;
  extraPriceLkr: number | null;
}

export interface FullArtwork {
  id:              string;
  slug:            string;
  imageURL:        string;
  images:          string[];
  title:           string;
  artistName:      string;
  category:        string;
  medium:          string;
  size:            string;
  price:           number;
  likes:           number;
  description:     string;
  frameDetails:    string;
  prints?:         DetailPrint[];
  frames?:         Frame[];
  originalArtRaw?: { widthCm: number; heightCm: number };
}

// ─── API response shapes ──────────────────────────────────────────────────────

export interface ApiPrintSize {
  width?:  number;
  height?: number;
  price?:  number;
}

export interface ApiPrint {
  surfaceMaterial?: string;
  sizes?:           ApiPrintSize[];
}

export interface ApiFrameOption {
  material?:      string;
  color?:         string;
  widthCm?:       number;
  extraPriceLkr?: number;
}

export interface ArtworkApiResponse {
  error?:               string;
  _id:                  string;
  name:                 string;
  category?:            string;
  description?:         string;
  mainImageUrl:         string;
  supportingImageUrls?: string[];
  artistName?:          string;
  originalArt?: {
    surfaceMaterial?: string;
    widthCm?:         number;
    heightCm?:        number;
    priceLkr?:        number;
    isFramed?:        boolean;
  };
  frameOptions?: ApiFrameOption[];
  prints?:       ApiPrint[];
}