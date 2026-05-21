/**
 * Seed sample artists into MongoDB Atlas.
 * Run: npx ts-node-dev --transpile-only ./src/scripts/seedArtists.ts
 */
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/user.model";

dotenv.config();

const ARTISTS = [
  {
    firstName: "Melissa",
    lastName: "Peters",
    email: "melissa@artiverse.lk",
    password: "Artist123!",
    slug: "melissa-peters",
    country: "Sri Lanka",
    district: "Colombo",
    profileImage:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    backgroundImage:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80",
    artCategories: ["Acrylic", "Oil paint", "Spray Paint"],
    aboutArtist:
      "From they fine john he give of rich he. They age and draw mrs like. Improving end distrusts may instantly was household applauded incommode.",
    socialLinks: {
      facebook: "https://facebook.com/melissapeters",
      instagram: "https://instagram.com/melissapeters",
      website: "https://melissapeters.art",
      tiktok: "https://tiktok.com/@melissapeters",
      youtube: "https://youtube.com/@melissapeters",
    },
    followersCount: 12900,
    isVerified: true,
  },
  {
    firstName: "Noah",
    lastName: "Bennett",
    email: "noah@artiverse.lk",
    password: "Artist123!",
    slug: "noah-bennett",
    country: "Sri Lanka",
    district: "Kandy",
    profileImage:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    backgroundImage:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80",
    artCategories: ["Watercolor", "Ink", "Charcoal"],
    aboutArtist:
      "From they fine john he give of rich he. They age and draw mrs like.",
    socialLinks: {
      facebook: "https://facebook.com/noahbennett",
      instagram: "https://instagram.com/noahbennett",
      website: "https://noahbennett.studio",
      youtube: "https://youtube.com/@noahbennett",
    },
    followersCount: 10400,
    isVerified: true,
  },
  {
    firstName: "Ava",
    lastName: "Martinez",
    email: "ava@artiverse.lk",
    password: "Artist123!",
    slug: "ava-martinez",
    country: "Sri Lanka",
    district: "Galle",
    profileImage:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    backgroundImage:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
    artCategories: ["Acrylic", "Mixed media"],
    aboutArtist:
      "From they fine john he give of rich he. They age and draw mrs like.",
    socialLinks: {
      instagram: "https://instagram.com/avamartinez",
      tiktok: "https://tiktok.com/@avamartinez",
    },
    followersCount: 11800,
  },
  {
    firstName: "Leo",
    lastName: "Carter",
    email: "leo@artiverse.lk",
    password: "Artist123!",
    slug: "leo-carter",
    country: "Sri Lanka",
    district: "Negombo",
    profileImage:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80",
    backgroundImage:
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1600&q=80",
    artCategories: ["Oil paint", "Pastel"],
    aboutArtist:
      "From they fine john he give of rich he. They age and draw mrs like.",
    socialLinks: {
      facebook: "https://facebook.com/leocarter",
      instagram: "https://instagram.com/leocarter",
      website: "https://leocarter.com",
      youtube: "https://youtube.com/@leocarter",
    },
    followersCount: 13200,
    isVerified: true,
  },
];

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI missing");

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  for (const data of ARTISTS) {
    const existing = await User.findOne({ email: data.email });
    if (existing) {
      console.log(`Skip (exists): ${data.email}`);
      continue;
    }

    await User.create({
      ...data,
      role: "artist",
      contactNumber: "",
      receiveEmails: false,
      followingCount: 0,
      address: "123, Main Street",
      postalCode: "00100",
    });
    console.log(`Created: ${data.firstName} ${data.lastName}`);
  }

  console.log("Seed complete.");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
