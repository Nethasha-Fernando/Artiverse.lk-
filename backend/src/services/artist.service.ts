import mongoose from "mongoose";
import User, { IUser } from "../models/user.model";
import Artwork from "../models/artwork.model";

const DEFAULT_PROFILE =
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80";
const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80";

function formatJoinedDate(date?: Date): string {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

async function getArtworksCount(artistId: string): Promise<number> {
  return Artwork.countDocuments({ artist: artistId });
}

async function getArtistArtworks(artistId: string) {
  const items = await Artwork.find({ artist: artistId })
    .select("name mainImageUrl")
    .sort({ createdAt: -1 })
    .limit(12)
    .lean();

  return items.map((a) => ({
    id: String(a._id),
    title: a.name,
    image: a.mainImageUrl,
  }));
}

export async function mapUserToArtistProfile(user: IUser) {
  const id = String(user._id);
  const artworksCount = await getArtworksCount(id);
  const artworks = await getArtistArtworks(id);

  const social = user.socialLinks || {};
  const personalLinks = social.website
    ? [{ label: "Website", url: social.website }]
    : [];

  return {
    id,
    slug: user.slug || id,
    name: `${user.firstName} ${user.lastName}`.trim(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    city: user.district,
    country: user.country,
    profileImage: user.profileImage || DEFAULT_PROFILE,
    coverImage: user.backgroundImage || DEFAULT_COVER,
    followers: user.followersCount ?? 0,
    likes: 0,
    artworksCount,
    dateJoined: formatJoinedDate(user.createdAt),
    activeSince: formatJoinedDate(user.createdAt),
    website: social.website || undefined,
    personalLinks,
    about: user.aboutArtist || "",
    tags: user.artCategories || [],
    socialLinks: {
      facebook: social.facebook || undefined,
      instagram: social.instagram || undefined,
      tiktok: social.tiktok || undefined,
      youtube: social.youtube || undefined,
    },
    upcomingEvents: [],
    events: [],
    artworks,
    verified: user.isVerified ?? false,
    address: user.address,
    postalCode: user.postalCode,
    artCategories: user.artCategories,
    aboutArtist: user.aboutArtist,
    district: user.district,
    backgroundImage: user.backgroundImage,
    followersCount: user.followersCount,
    followingCount: user.followingCount,
    joinedDate: user.createdAt,
    role: user.role,
  };
}

export async function mapUserToListItem(user: IUser) {
  return {
    id: String(user._id),
    slug: user.slug || String(user._id),
    name: `${user.firstName} ${user.lastName}`.trim(),
    profileImage: user.profileImage || DEFAULT_PROFILE,
    coverImage: user.backgroundImage || DEFAULT_COVER,
    followers: user.followersCount ?? 0,
    likes: 0,
  };
}

export async function findArtistByIdOrSlug(idOrSlug: string) {
  const query = mongoose.isValidObjectId(idOrSlug)
    ? { _id: idOrSlug, role: "artist" }
    : { slug: idOrSlug.toLowerCase(), role: "artist" };

  return User.findOne(query);
}

export async function listArtists() {
  return User.find({ role: "artist" }).sort({ createdAt: -1 });
}

export async function findArtistById(userId: string) {
  return User.findOne({ _id: userId, role: "artist" });
}
