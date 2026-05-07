import { Request, Response } from "express";
import Artwork from "../models/artwork.model";
import { listArtworksService } from "../services/listArtwork";
import { artworkDetailsService } from "../services/artworkDetail";

/** POST /api/artworks */  //creates the artworks and saves in mongo DB and returns eturns the created doc.
export async function createArtwork(req: Request, res: Response) {
  try {
    // already validated & trimmed by middleware
    const {
      name,
      description,
      orientation,
      mainImageUrl,
      supportingImageUrls,
      originalArt,
      frameOptions,
      prints,
      framesAvailable,
    } = req.body;

    const doc = await Artwork.create({
      name,
      description,
      orientation,
      mainImageUrl,
      supportingImageUrls,
      originalArt,
      frameOptions,
      prints,
      framesAvailable,
    });  //code it checks for artwork.validation then validateReqauts befofe controller in middleware then artwork created and this also enforces the rules like check for errors
    return res.status(201).json(doc); // so a JSON file with all detaols id,name etc
  } catch (err: any) {
    if (err?.code === 11000) {
      return res.status(409).json({ error: "Duplicate value. A unique field already exists." });
    }
    if (err?.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    console.error("createArtwork error:", err);
    return res.status(500).json({ error: "Server error. Please try again." });
  }
}

/** GET /api/artworks */  //shows the artworks by find all the latest to oldest from the saved artwrks on mongoDb
//export async function listArtworks(_req: Request, res: Response) {
///  try {
//    const items = await Artwork.find({ name: { $exists: true, $ne: null } })
//      .select({ name: 1, description: 1, orientation:1, mainImageUrl:1 , supportingImageUrls:1  , createdAt: 1, updatedAt: 1 })
//      .sort({ createdAt: -1 })
//      .lean();

//    return res.json(items);
//  } catch (err) {
//    console.error("listArtworks error:", err);
//    return res.status(500).json({ error: "Server error. Please try again." });
//  }
//}

// These codes are the ones that connects evrthing with mongo DB
//mongoose.connect(MONGO_URI)
// const artworkSchema = new mongoose.Schema({...}, { timestamps: true });
//export default mongoose.model("Artwork", artworkSchema);


// src/controllers/artwork.controller.ts


export async function listArtworks(_req: Request, res: Response) {
  try {
    const items = await listArtworksService();
    return res.json(items);
  } catch (err) {
    console.error("listArtworks error:", err);
    return res.status(500).json({ error: "Server error. Please try again." });
  }
}

export async function artworkDetail(req: Request, res: Response) {
  try {
    const { idOrSlug } = req.params; //get the id or slug from the URL parameters (e.g., /api/artworks/:idOrSlug)

    const item = await artworkDetailsService(idOrSlug); // pass ID or slug and calls the service
    if (!item) {
      return res.status(404).json({ error: "Artwork not found" });
    }

    return res.json(item);
  } catch (err) {
    console.error("artworkDetail error:", err);
    return res.status(500).json({ error: "Server error. Please try again." });
  }
}
export async function deleteArtwork(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await Artwork.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Artwork not found" });
    }
    return res.json({ message: "Artwork deleted successfully" });
  } catch (err) {
    console.error("deleteArtwork error:", err);
    return res.status(500).json({ error: "Server error. Please try again." });
  }
}





