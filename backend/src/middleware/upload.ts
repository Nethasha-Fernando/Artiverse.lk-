import fs from "fs";
import path from "path";
import multer from "multer";

const profileDir = path.join(process.cwd(), "uploads", "artists", "profiles");
const backgroundDir = path.join(process.cwd(), "uploads", "artists", "backgrounds");

[profileDir, backgroundDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

function imageStorage(destination: string) {
  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, destination),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
      const safe = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, safe);
    },
  });
}

const imageFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed."));
  }
};

export const uploadProfileImage = multer({
  storage: imageStorage(profileDir),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter,
}).single("image");

export const uploadBackgroundImage = multer({
  storage: imageStorage(backgroundDir),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: imageFilter,
}).single("image");

export function toPublicUploadUrl(filename: string, type: "profiles" | "backgrounds"): string {
  return `/uploads/artists/${type}/${filename}`;
}
