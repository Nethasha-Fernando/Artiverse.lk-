import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import User from "../models/user.model";

const ACCESS_EXPIRES  = "15m";
const REFRESH_EXPIRES = "7d";
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7d in ms

function signAccessToken(id: string, role: string) {
  return (jwt.sign as any)({ id, role }, process.env.JWT_SECRET!, {
    expiresIn: ACCESS_EXPIRES,
  });
}

function signRefreshToken(id: string) {
  return (jwt.sign as any)({ id }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: REFRESH_EXPIRES,
  });
}

function setRefreshCookie(res: Response, token: string) {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge:   REFRESH_MAX_AGE,
    path:     "/api/auth/refresh", // only sent to this route
  });
}

export async function register(req: Request, res: Response) {
  try {
    const { firstName, lastName, email, password, contactNumber, role, receiveEmails } = req.body;

    if (!firstName || !lastName || !email || !password)
      return res.status(400).json({ error: "First name, last name, email and password are required." });
    if (password.length < 6)
      return res.status(400).json({ error: "Password must be at least 6 characters." });

    const user = await User.create({
      firstName, lastName, email, password,
      contactNumber: contactNumber || "",
      role: role === "artist" ? "artist" : "user",
      receiveEmails: receiveEmails ?? false,
    });

    const accessToken  = signAccessToken(String(user._id), user.role);
    const refreshToken = signRefreshToken(String(user._id));
    setRefreshCookie(res, refreshToken);

    return res.status(201).json({
      accessToken,
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, contactNumber: user.contactNumber },
    });
  } catch (err: any) {
    if (err?.code === 11000)
      return res.status(409).json({ error: "An account with that email already exists." });
    console.error("register error:", err);
    return res.status(500).json({ error: "Server error. Please try again." });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required." });

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ error: "Invalid email or password." });

    const accessToken  = signAccessToken(String(user._id), user.role);
    const refreshToken = signRefreshToken(String(user._id));
    setRefreshCookie(res, refreshToken);

    return res.json({
      accessToken,
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ error: "Server error. Please try again." });
  }
}

// NEW: POST /api/auth/refresh
export async function refresh(req: Request, res: Response) {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ error: "No refresh token." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { id: string };
    const user    = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ error: "User not found." });

    const accessToken  = signAccessToken(String(user._id), user.role);
    const refreshToken = signRefreshToken(String(user._id)); // rotate!
    setRefreshCookie(res, refreshToken);

    return res.json({ accessToken });
  } catch {
    return res.status(401).json({ error: "Invalid or expired refresh token." });
  }
}

// NEW: POST /api/auth/logout
export async function logout(_req: Request, res: Response) {
  res.clearCookie("refreshToken", { path: "/api/auth/refresh" });
  return res.json({ message: "Logged out." });
}