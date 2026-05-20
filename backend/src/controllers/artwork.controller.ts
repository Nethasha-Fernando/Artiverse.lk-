import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authenticate";
import Artwork from "../models/artwork.model";
import { listArtworksService } from "../services/listArtwork";
import { artworkDetailsService } from "../services/artworkDetail";

/** POST /api/artworks — artists only */
export async function createArtwork(req: AuthRequest, res: Response) {
  try {
    const {
      name, description, orientation,
      mainImageUrl, supportingImageUrls,
      originalArt, frameOptions, prints, framesAvailable,
    } = req.body;

    const doc = await Artwork.create({
      artist: req.user!.id,  // stamp the logged-in artist's id
      name, description, orientation,
      mainImageUrl, supportingImageUrls,
      originalArt, frameOptions, prints, framesAvailable,
    });

    return res.status(201).json(doc);
  } catch (err: any) {
    if (err?.code === 11000) {
      return res.status(409).json({ error: "Duplicate value." });
    }
    if (err?.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    console.error("createArtwork error:", err);
    return res.status(500).json({ error: "Server error. Please try again." });
  }
}

/** GET /api/artworks — public */
export async function listArtworks(_req: Request, res: Response) {
  try {
    const items = await listArtworksService();
    return res.json(items);
  } catch (err) {
    console.error("listArtworks error:", err);
    return res.status(500).json({ error: "Server error. Please try again." });
  }
}

/** GET /api/artworks/:idOrSlug — public */
export async function artworkDetail(req: Request, res: Response) {
  try {
    const { idOrSlug } = req.params;
    const item = await artworkDetailsService(idOrSlug);
    if (!item) {
      return res.status(404).json({ error: "Artwork not found." });
    }
    return res.json(item);
  } catch (err) {
    console.error("artworkDetail error:", err);
    return res.status(500).json({ error: "Server error. Please try again." });
  }
}

/** DELETE /api/artworks/:id — artists only, own artworks only */
export async function deleteArtwork(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    const artwork = await Artwork.findById(id);
    if (!artwork) {
      return res.status(404).json({ error: "Artwork not found." });
    }

    // ownership check — can only delete your own artwork
    if (String(artwork.artist) !== req.user!.id) {
      return res.status(403).json({ error: "You can only delete your own artworks." });
    }

    await artwork.deleteOne();
    return res.json({ message: "Artwork deleted successfully." });
  } catch (err) {
    console.error("deleteArtwork error:", err);
    return res.status(500).json({ error: "Server error. Please try again." });
  }
}