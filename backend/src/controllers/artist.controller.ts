import { Response, NextFunction } from "express";
import User from "../models/user.model";
import { AuthRequest } from "../middleware/authenticate";
import { toPublicUploadUrl } from "../middleware/upload";
import {
  findArtistById,
  findArtistByIdOrSlug,
  listArtists,
  mapUserToArtistProfile,
  mapUserToListItem,
} from "../services/artist.service";

// GET /api/artists
export async function getAllArtists(_req: AuthRequest, res: Response) {
  try {
    const users = await listArtists();
    const artists = await Promise.all(users.map((u) => mapUserToListItem(u)));
    return res.json({ artists });
  } catch (err) {
    console.error("getAllArtists error:", err);
    return res.status(500).json({ error: "Failed to fetch artists." });
  }
}

// GET /api/artists/me
export async function getMyProfile(req: AuthRequest, res: Response) {
  try {
    const user = await findArtistById(req.user!.id);
    if (!user) {
      return res.status(404).json({ error: "Artist profile not found." });
    }
    const profile = await mapUserToArtistProfile(user);
    return res.json(profile);
  } catch (err) {
    console.error("getMyProfile error:", err);
    return res.status(500).json({ error: "Failed to fetch your profile." });
  }
}

// GET /api/artists/:id
export async function getArtistById(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const user = await findArtistByIdOrSlug(id);
    if (!user) {
      return res.status(404).json({ error: "Artist not found." });
    }
    const profile = await mapUserToArtistProfile(user);
    return res.json(profile);
  } catch (err) {
    console.error("getArtistById error:", err);
    return res.status(500).json({ error: "Failed to fetch artist profile." });
  }
}

// PUT /api/artists/update-profile
export async function updateProfile(req: AuthRequest, res: Response) {
  try {
    const user = await User.findById(req.user!.id);
    if (!user || user.role !== "artist") {
      return res.status(403).json({ error: "Artists only." });
    }

    const {
      firstName,
      lastName,
      country,
      district,
      address,
      postalCode,
      artCategories,
      aboutArtist,
      socialLinks,
    } = req.body;

    if (firstName !== undefined) {
      if (!String(firstName).trim()) {
        return res.status(400).json({ error: "First name is required." });
      }
      user.firstName = String(firstName).trim();
    }
    if (lastName !== undefined) {
      if (!String(lastName).trim()) {
        return res.status(400).json({ error: "Last name is required." });
      }
      user.lastName = String(lastName).trim();
    }
    if (country !== undefined) user.country = String(country).trim();
    if (district !== undefined) user.district = String(district).trim();
    if (address !== undefined) user.address = String(address).trim();
    if (postalCode !== undefined) user.postalCode = String(postalCode).trim();
    if (aboutArtist !== undefined) user.aboutArtist = String(aboutArtist).trim();

    if (artCategories !== undefined) {
      user.artCategories = Array.isArray(artCategories)
        ? artCategories.map(String)
        : [];
    }

    if (socialLinks && typeof socialLinks === "object") {
      user.socialLinks = {
        ...user.socialLinks,
        facebook:  socialLinks.facebook  ?? user.socialLinks?.facebook  ?? "",
        instagram: socialLinks.instagram ?? user.socialLinks?.instagram ?? "",
        linkedin:  socialLinks.linkedin  ?? user.socialLinks?.linkedin  ?? "",
        twitter:   socialLinks.twitter   ?? user.socialLinks?.twitter   ?? "",
        website:   socialLinks.website   ?? user.socialLinks?.website   ?? "",
        tiktok:    socialLinks.tiktok    ?? user.socialLinks?.tiktok    ?? "",
        youtube:   socialLinks.youtube   ?? user.socialLinks?.youtube   ?? "",
      };
    }

    await user.save();
    const profile = await mapUserToArtistProfile(user);
    return res.json({ message: "Profile updated successfully.", profile });
  } catch (err) {
    console.error("updateProfile error:", err);
    return res.status(500).json({ error: "Failed to update profile." });
  }
}

// POST /api/artists/upload-profile-image
export async function uploadProfileImageHandler(
  req: AuthRequest,
  res: Response,
) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided." });
    }

    const user = await User.findById(req.user!.id);
    if (!user || user.role !== "artist") {
      return res.status(403).json({ error: "Artists only." });
    }

    user.profileImage = toPublicUploadUrl(req.file.filename, "profiles");
    await user.save();

    return res.json({
      message: "Profile image updated.",
      profileImage: user.profileImage,
    });
  } catch (err) {
    console.error("uploadProfileImage error:", err);
    return res.status(500).json({ error: "Failed to upload profile image." });
  }
}

// POST /api/artists/upload-background-image
export async function uploadBackgroundImageHandler(
  req: AuthRequest,
  res: Response,
) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided." });
    }

    const user = await User.findById(req.user!.id);
    if (!user || user.role !== "artist") {
      return res.status(403).json({ error: "Artists only." });
    }

    user.backgroundImage = toPublicUploadUrl(req.file.filename, "backgrounds");
    await user.save();

    return res.json({
      message: "Background image updated.",
      backgroundImage: user.backgroundImage,
    });
  } catch (err) {
    console.error("uploadBackgroundImage error:", err);
    return res.status(500).json({ error: "Failed to upload background image." });
  }
}

/** Multer error wrapper */
export function handleUpload(
  uploadMiddleware: (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => void,
  handler: (req: AuthRequest, res: Response) => Promise<Response | void>,
) {
  return (req: AuthRequest, res: Response) => {
    uploadMiddleware(req, res, (err: unknown) => {
      if (err) {
        const message =
          err instanceof Error ? err.message : "Upload failed.";
        return res.status(400).json({ error: message });
      }
      return handler(req, res);
    });
  };
}
