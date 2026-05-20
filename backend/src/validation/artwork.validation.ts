export type ArtworkCreate = {
  name: string;
  description?: string;
  category: string;
  orientation: "Landscape" | "Portrait" | "Square";
  mainImageUrl: string;
  supportingImageUrls: string[]; // it should be an array, not string

  originalArt: {
    surfaceMaterial: string;
    widthCm: number;
    heightCm: number; 
    priceLkr: number;
    isFramed: boolean;
    frameDetails?: string;
  };

  frameOptions?: {
    material: string;
    color?: string;
    widthCm?: number;
    extraPriceLkr?: number;
  }[];

  prints?: {
    surfaceMaterial: string;
    widthCm: number;
    heightCm: number;
    priceLkr: number;
  }[];

  framesAvailable?: {
    frameMaterial: string;
    color?: string;
    widthCm?: number;
    offerings?: {
      surfaceMaterial: string;
      sizes: {
        widthCm: number;
        heightCm: number;
        framePriceLkr: number;
      }[];
    }[];
  }[];
};



