import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import authRoutes    from "./routes/auth.routes";
import artworkRoutes from "./routes/artwork.routes";
import artistRoutes  from "./routes/artist.routes";

dotenv.config();

const app = express();

// ---------- Middlewares ----------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- Static files ----------
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ---------- Health check ----------
app.get("/health", (_req, res) => {
  const stateNames: Record<number, string> = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  res.status(200).json({
    status: "ok",
    db:         stateNames[mongoose.connection.readyState] ?? "unknown",
    uptime_sec: Math.round(process.uptime()),
    time:       new Date().toISOString(),
  });
});

// ---------- Routes ----------
app.use("/api/auth",     authRoutes);
app.use("/api/artworks", artworkRoutes);
app.use("/api/artists",  artistRoutes);

// ---------- DB + Server ----------
const PORT      = Number(process.env.PORT) || 4000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("❌ MONGO_URI is missing in .env file");
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ API running at http://localhost:${PORT}`);
      console.log(`🩺 Health:       GET  http://localhost:${PORT}/health`);
      console.log(`🔐 Auth:         POST http://localhost:${PORT}/api/auth/register`);
      console.log(`🔐 Auth:         POST http://localhost:${PORT}/api/auth/login`);
      console.log(`🎨 Artworks:     GET  http://localhost:${PORT}/api/artworks`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

export default app;