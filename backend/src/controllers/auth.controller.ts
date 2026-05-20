import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import User from "../models/user.model";

// ── sign JWT with both id AND role ──────────────────────

function signToken(id: string, role: string): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (jwt.sign as any)(
    { id, role },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

// ── POST /api/auth/register ─────────────────────────────
export async function register(req: Request, res: Response) {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      contactNumber,
      role,
      receiveEmails,
    } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        error: "First name, last name, email and password are required.",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters.",
      });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      contactNumber: contactNumber || "",
      role: role === "artist" ? "artist" : "user",
      receiveEmails: receiveEmails ?? false,
    });

    const token = signToken(String(user._id), user.role); // ← role passed

    return res.status(201).json({
      token,
      user: {
        id:            user._id,
        firstName:     user.firstName,
        lastName:      user.lastName,
        email:         user.email,
        role:          user.role,
        contactNumber: user.contactNumber,
      },
    });

  } catch (err: any) {
    if (err?.code === 11000) {
      return res.status(409).json({ error: "An account with that email already exists." });
    }
    console.error("register error:", err);
    return res.status(500).json({ error: "Server error. Please try again." });
  }
}

// ── POST /api/auth/login ────────────────────────────────
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = signToken(String(user._id), user.role); // ← role passed

    return res.json({
      token,
      user: {
        id:        user._id,
        firstName: user.firstName,
        lastName:  user.lastName,
        email:     user.email,
        role:      user.role,
      },
    });

  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ error: "Server error. Please try again." });
  }
}