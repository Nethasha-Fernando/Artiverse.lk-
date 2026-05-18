// src/server.ts
// Entry point: sets up Express, connects MongoDB, mounts routes, and exposes /health.

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import artworkRoutes from "./routes/artwork.routes";
import path from "path";

dotenv.config();

const app = express();

// ---------- Middlewares ----------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- Health Check ----------
app.get("/health", (_req, res) => {   //just to see of mongoDb is connected
  // readyState codes: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  const stateNames: Record<number, string> = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  const db = stateNames[mongoose.connection.readyState] ?? "unknown";  //acording to the state the number is given

  res.status(200).json({  //if no errors (200)
    status: "ok",
    db,
    uptime_sec: Math.round(process.uptime()),
    time: new Date().toISOString(),
  });
});


app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ---------- Routes ----------
app.use("/api/artworks", artworkRoutes);  //so all URLs start with /api/artworks


// ---------- DB + Server ----------
const PORT = Number(process.env.PORT) || 4000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("❌ MONGO_URI is missing in .env file");
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ API running at http://localhost:${PORT}`);
      console.log(`🩺 Health:        GET http://localhost:${PORT}/health`);
      console.log(`🎨 Artworks API:  GET/POST http://localhost:${PORT}/api/artworks`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

export default app;
