import { Router } from "express";
import {
  confirmAttendance,
  createEvent,
  deleteEvent,
  filterEvents,
  getArtistEvents,
  getAttendingEvents,
  getEvent,
  getEvents,
  updateEvent,
  uploadEventCover,
} from "../controllers/event.controller";
import { authenticate, requireArtist } from "../middleware/authenticate";
import { optionalAuthenticate } from "../middleware/optionalAuth";
import { uploadEventCover as uploadMiddleware } from "../middleware/upload";

const router = Router();

router.get("/", getEvents);
router.get("/filter", filterEvents);
router.get("/user/attending", authenticate, getAttendingEvents);
router.get("/artist/:artistId", optionalAuthenticate, getArtistEvents);

router.post(
  "/upload-cover",
  authenticate,
  requireArtist,
  uploadMiddleware.single("coverImage"),
  uploadEventCover,
);

router.post("/", authenticate, requireArtist, createEvent);
router.put("/:id", authenticate, requireArtist, updateEvent);
router.delete("/:id", authenticate, requireArtist, deleteEvent);
router.post("/:id/confirm-attendance", authenticate, confirmAttendance);

router.get("/:id", optionalAuthenticate, getEvent);

export default router;
