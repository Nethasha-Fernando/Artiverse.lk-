import mongoose from "mongoose";
import Event, { IEvent } from "../models/event.model";

export interface EventQueryFilters {
  date?: string;
  start?: string;
  end?: string;
  month?: string;
  upcoming?: boolean | string;
  artistId?: string;
  status?: "draft" | "published";
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

export function buildEventFilter(query: EventQueryFilters) {
  const filter: Record<string, unknown> = {};

  if (query.status) {
    filter.status = query.status;
  } else {
    filter.status = "published";
  }

  if (query.artistId && mongoose.isValidObjectId(query.artistId)) {
    filter.createdByArtist = query.artistId;
  }

  const dateFilter: Record<string, Date> = {};

  if (query.upcoming === true || query.upcoming === "true") {
    dateFilter.$gte = startOfDay(new Date());
  }

  if (query.date) {
    const d = new Date(query.date);
    if (!isNaN(d.getTime())) {
      filter.eventDate = { $gte: startOfDay(d), $lte: endOfDay(d) };
    }
  } else if (query.start || query.end) {
    if (query.start) {
      const s = new Date(query.start);
      if (!isNaN(s.getTime())) dateFilter.$gte = startOfDay(s);
    }
    if (query.end) {
      const e = new Date(query.end);
      if (!isNaN(e.getTime())) dateFilter.$lte = endOfDay(e);
    }
    if (Object.keys(dateFilter).length) filter.eventDate = dateFilter;
  } else if (query.month) {
    const [y, m] = query.month.split("-").map(Number);
    if (y && m) {
      const start = new Date(y, m - 1, 1);
      const end = new Date(y, m, 0, 23, 59, 59, 999);
      filter.eventDate = { $gte: start, $lte: end };
    }
  } else if (dateFilter.$gte) {
    filter.eventDate = dateFilter;
  }

  return filter;
}

export function formatEventDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTimeRange(start: string, end: string): string {
  return `${start} - ${end}`;
}

export async function mapEventToCard(event: IEvent) {
  const artist = await mongoose.model("User").findById(event.createdByArtist).select("firstName lastName slug");
  return {
    id: String(event._id),
    title: event.title,
    summary: event.summary,
    coverImage: event.coverImage,
    location: event.locationName,
    date: formatEventDate(event.eventDate),
    time: formatTimeRange(event.startTime, event.endTime),
    eventDate: event.eventDate,
    startTime: event.startTime,
    endTime: event.endTime,
    attendeesCount: event.attendeesCount,
    status: event.status,
    createdByArtist: String(event.createdByArtist),
    artistName: artist
      ? `${(artist as { firstName: string }).firstName} ${(artist as { lastName: string }).lastName}`
      : undefined,
  };
}

export async function mapEventToDetail(event: IEvent, userId?: string) {
  const card = await mapEventToCard(event);
  const isAttending = userId
    ? event.attendees.some((id) => String(id) === userId)
    : false;

  return {
    ...card,
    description: event.description,
    mapLocation: event.mapLocation || event.locationName,
    latitude: event.latitude,
    longitude: event.longitude,
    isAttending,
    attendees: event.attendees.map(String),
  };
}

export async function listEvents(query: EventQueryFilters) {
  const filter = buildEventFilter(query);
  const events = await Event.find(filter).sort({ eventDate: 1 });
  return Promise.all(events.map(mapEventToCard));
}

export async function getEventById(id: string, userId?: string) {
  if (!mongoose.isValidObjectId(id)) return null;
  const event = await Event.findById(id);
  if (!event) return null;
  return mapEventToDetail(event, userId);
}

export async function getEventsByArtist(artistId: string, includeDrafts = false) {
  const filter: Record<string, unknown> = { createdByArtist: artistId };
  if (!includeDrafts) filter.status = "published";
  const events = await Event.find(filter).sort({ eventDate: 1 });
  return Promise.all(events.map(mapEventToCard));
}

export async function getUserAttendingEvents(userId: string) {
  const events = await Event.find({
    attendees: userId,
    status: "published",
  }).sort({ eventDate: 1 });
  return Promise.all(events.map(mapEventToCard));
}
