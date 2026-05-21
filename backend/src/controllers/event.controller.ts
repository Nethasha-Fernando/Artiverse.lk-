import { Response } from "express";
import mongoose from "mongoose";
import Event from "../models/event.model";
import { AuthRequest } from "../middleware/authenticate";
import {
  buildEventFilter,
  getEventById,
  getEventsByArtist,
  getUserAttendingEvents,
  listEvents,
  mapEventToCard,
} from "../services/event.service";

function handleUpload(req: AuthRequest, res: Response) {
  const file = req.file as Express.Multer.File | undefined;
  if (!file) {
    return res.status(400).json({ error: "No image file provided." });
  }
  const url = `/uploads/events/${file.filename}`;
  return res.json({ url });
}

export async function uploadEventCover(req: AuthRequest, res: Response) {
  return handleUpload(req, res);
}

export async function getEvents(req: AuthRequest, res: Response) {
  try {
    const upcoming = req.query.upcoming === "true" || req.query.upcoming === "1";
    const events = await listEvents({
      date: req.query.date as string | undefined,
      start: req.query.start as string | undefined,
      end: req.query.end as string | undefined,
      month: req.query.month as string | undefined,
      upcoming,
      artistId: req.query.artistId as string | undefined,
      status: "published",
    });
    return res.json({ events });
  } catch (err) {
    console.error("getEvents:", err);
    return res.status(500).json({ error: "Failed to fetch events." });
  }
}

export async function filterEvents(req: AuthRequest, res: Response) {
  return getEvents(req, res);
}

export async function getEvent(req: AuthRequest, res: Response) {
  try {
    const raw = await Event.findById(req.params.id);
    if (!raw) {
      return res.status(404).json({ error: "Event not found." });
    }
    if (
      raw.status === "draft" &&
      String(raw.createdByArtist) !== req.user?.id
    ) {
      return res.status(404).json({ error: "Event not found." });
    }
    const event = await getEventById(req.params.id, req.user?.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }
    return res.json({ event });
  } catch (err) {
    console.error("getEvent:", err);
    return res.status(500).json({ error: "Failed to fetch event." });
  }
}

export async function getArtistEvents(req: AuthRequest, res: Response) {
  try {
    const { artistId } = req.params;
    const includeDrafts =
      req.user?.id === artistId && req.user?.role === "artist";
    const events = await getEventsByArtist(artistId, includeDrafts);
    return res.json({ events });
  } catch (err) {
    console.error("getArtistEvents:", err);
    return res.status(500).json({ error: "Failed to fetch artist events." });
  }
}

export async function getAttendingEvents(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Authentication required." });
    }
    const events = await getUserAttendingEvents(req.user.id);
    return res.json({ events });
  } catch (err) {
    console.error("getAttendingEvents:", err);
    return res.status(500).json({ error: "Failed to fetch attending events." });
  }
}

export async function createEvent(req: AuthRequest, res: Response) {
  try {
    const {
      title,
      summary,
      description,
      coverImage,
      eventDate,
      startTime,
      endTime,
      locationName,
      mapLocation,
      latitude,
      longitude,
      status,
    } = req.body;

    if (!title || !summary || !coverImage || !eventDate || !startTime || !endTime || !locationName) {
      return res.status(400).json({ error: "Missing required event fields." });
    }

    const event = await Event.create({
      title,
      summary,
      description: description || "",
      coverImage,
      eventDate: new Date(eventDate),
      startTime,
      endTime,
      locationName,
      mapLocation: mapLocation || locationName,
      latitude: latitude ?? 6.9271,
      longitude: longitude ?? 79.8612,
      createdByArtist: req.user!.id,
      status: status === "draft" ? "draft" : "published",
    });

    const mapped = await mapEventToCard(event);
    return res.status(201).json({ event: mapped });
  } catch (err) {
    console.error("createEvent:", err);
    return res.status(500).json({ error: "Failed to create event." });
  }
}

export async function updateEvent(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid event id." });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    if (String(event.createdByArtist) !== req.user!.id) {
      return res.status(403).json({ error: "You can only edit your own events." });
    }

    if (req.body.title !== undefined) event.title = req.body.title;
    if (req.body.summary !== undefined) event.summary = req.body.summary;
    if (req.body.description !== undefined) event.description = req.body.description;
    if (req.body.coverImage !== undefined) event.coverImage = req.body.coverImage;
    if (req.body.eventDate !== undefined) event.eventDate = new Date(req.body.eventDate);
    if (req.body.startTime !== undefined) event.startTime = req.body.startTime;
    if (req.body.endTime !== undefined) event.endTime = req.body.endTime;
    if (req.body.locationName !== undefined) event.locationName = req.body.locationName;
    if (req.body.mapLocation !== undefined) event.mapLocation = req.body.mapLocation;
    if (req.body.latitude !== undefined) event.latitude = Number(req.body.latitude);
    if (req.body.longitude !== undefined) event.longitude = Number(req.body.longitude);
    if (req.body.status !== undefined) event.status = req.body.status;

    await event.save();
    const mapped = await mapEventToCard(event);
    return res.json({ event: mapped });
  } catch (err) {
    console.error("updateEvent:", err);
    return res.status(500).json({ error: "Failed to update event." });
  }
}

export async function deleteEvent(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid event id." });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    if (String(event.createdByArtist) !== req.user!.id) {
      return res.status(403).json({ error: "You can only delete your own events." });
    }

    await event.deleteOne();
    return res.json({ message: "Event deleted." });
  } catch (err) {
    console.error("deleteEvent:", err);
    return res.status(500).json({ error: "Failed to delete event." });
  }
}

export async function confirmAttendance(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid event id." });
    }

    const event = await Event.findById(id);
    if (!event || event.status !== "published") {
      return res.status(404).json({ error: "Event not found." });
    }

    const userId = req.user!.id;
    const already = event.attendees.some((a) => String(a) === userId);
    if (already) {
      const mapped = await getEventById(id, userId);
      return res.json({ event: mapped, message: "Already confirmed." });
    }

    event.attendees.push(new mongoose.Types.ObjectId(userId));
    event.attendeesCount = event.attendees.length;
    await event.save();

    const mapped = await getEventById(id, userId);
    return res.json({ event: mapped });
  } catch (err) {
    console.error("confirmAttendance:", err);
    return res.status(500).json({ error: "Failed to confirm attendance." });
  }
}
