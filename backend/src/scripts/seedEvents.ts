/**
 * Seed sample events. Requires seeded artists first.
 * Run: npm run seed:events
 */
import dotenv from "dotenv";
import mongoose from "mongoose";
import Event from "../models/event.model";
import User from "../models/user.model";

dotenv.config();

const EVENTS = [
  {
    artistEmail: "melissa@artiverse.lk",
    title: "Gallery Opening",
    summary: "Explore our newest collection.",
    description:
      "Join us for an exclusive gallery opening featuring contemporary works from emerging Sri Lankan artists. Enjoy light refreshments, live music, and guided tours through the exhibition halls.",
    coverImage:
      "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=800&q=80",
    eventDate: new Date("2025-06-23"),
    startTime: "6:00 PM",
    endTime: "8:00 PM",
    locationName: "Colombo",
    mapLocation: "National Art Gallery, Colombo",
    latitude: 6.9271,
    longitude: 79.8612,
  },
  {
    artistEmail: "noah@artiverse.lk",
    title: "Art Workshop",
    summary: "Hands-on creative session for all levels.",
    description:
      "A guided workshop covering watercolor fundamentals, composition, and color theory. Materials provided. Limited seats available.",
    coverImage:
      "https://images.unsplash.com/photo-1460668267087-6aafa6ae72b7?auto=format&fit=crop&w=800&q=80",
    eventDate: new Date("2025-07-12"),
    startTime: "10:00 AM",
    endTime: "1:00 PM",
    locationName: "Kandy",
    mapLocation: "Kandy Cultural Centre",
    latitude: 7.2906,
    longitude: 80.6337,
  },
  {
    artistEmail: "ava@artiverse.lk",
    title: "Exhibition Night",
    summary: "An evening of live art and conversation.",
    description:
      "Experience immersive installations and meet the artists behind the works. Dress code: smart casual.",
    coverImage:
      "https://images.unsplash.com/photo-1540575467061-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    eventDate: new Date("2025-08-05"),
    startTime: "7:00 PM",
    endTime: "10:00 PM",
    locationName: "Galle",
    mapLocation: "Galle Fort Art Space",
    latitude: 6.0329,
    longitude: 80.217,
  },
];

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI missing");

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  for (const item of EVENTS) {
    const artist = await User.findOne({ email: item.artistEmail, role: "artist" });
    if (!artist) {
      console.warn(`Artist not found: ${item.artistEmail}, skipping event "${item.title}"`);
      continue;
    }

    const exists = await Event.findOne({
      title: item.title,
      createdByArtist: artist._id,
    });
    if (exists) {
      console.log(`Event already exists: ${item.title}`);
      continue;
    }

    await Event.create({
      title: item.title,
      summary: item.summary,
      description: item.description,
      coverImage: item.coverImage,
      eventDate: item.eventDate,
      startTime: item.startTime,
      endTime: item.endTime,
      locationName: item.locationName,
      mapLocation: item.mapLocation,
      latitude: item.latitude,
      longitude: item.longitude,
      createdByArtist: artist._id,
      status: "published",
      attendeesCount: 0,
    });
    console.log(`Created event: ${item.title}`);
  }

  await mongoose.disconnect();
  console.log("Done.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
