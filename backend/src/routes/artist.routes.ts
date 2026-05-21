import { Router } from "express";
import {
  authenticate,
  requireArtist,
} from "../middleware/authenticate";
import {
  getAllArtists,
  getArtistById,
  getMyProfile,
  handleUpload,
  updateProfile,
  uploadBackgroundImageHandler,
  uploadProfileImageHandler,
} from "../controllers/artist.controller";
import {
  uploadBackgroundImage,
  uploadProfileImage,
} from "../middleware/upload";

const router = Router();

router.get("/", getAllArtists);
router.get("/me", authenticate, requireArtist, getMyProfile);
router.put("/update-profile", authenticate, requireArtist, updateProfile);
router.post(
  "/upload-profile-image",
  authenticate,
  requireArtist,
  handleUpload(uploadProfileImage, uploadProfileImageHandler),
);
router.post(
  "/upload-background-image",
  authenticate,
  requireArtist,
  handleUpload(uploadBackgroundImage, uploadBackgroundImageHandler),
);
router.get("/:id", getArtistById);

export default router;
