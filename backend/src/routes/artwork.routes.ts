import { Router } from "express";
import {
  createArtwork, listArtworks, artworkDetail, deleteArtwork,
} from "../controllers/artwork.controller";
import validateRequest from "../middleware/validateRequest";
import { authenticate, requireArtist } from "../middleware/authenticate";

const router = Router();

// ✅ Public
router.get("/",          listArtworks);
router.get("/:idOrSlug", artworkDetail);

// 🔒 Artists only
router.post("/",      authenticate, requireArtist, validateRequest, createArtwork);
router.delete("/:id", authenticate, requireArtist, deleteArtwork);

export default router;