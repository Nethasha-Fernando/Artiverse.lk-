import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaGoogle, FaApple, FaFacebookF } from "react-icons/fa";
import AuthPageLayout from "../components/auth/AuthPageLayout";

// Inline SVG eye icons — no lucide dependency
function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
      <line x1="2" x2="22" y1="2" y2="22"/>
    </svg>
  );
}

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName:     "",
    lastName:      "",
    email:         "",
    password:      "",
    contactNumber: "",
    role:          "user" as "user" | "artist",
    receiveEmails: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");

  const set = (k: string, v: unknown) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const res  = await fetch("/api/auth/register", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      login(data.token, data.user);
      navigate("/artworks");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const socialButtons = [
    { Icon: FaGoogle,    label: "Google"   },
    { Icon: FaApple,     label: "Apple"    },
    { Icon: FaFacebookF, label: "Facebook" },
  ];

  return (
    <AuthPageLayout>
      <div className="space-y-4 text-white">
        <h1 className="text-2xl font-bold text-center">Create an account</h1>

        {/* Email */}
        <div>
          <label className="text-xs text-gray-300 mb-1 block">Email address</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-red-400 placeholder:text-gray-400"
          />
        </div>

        {/* First + Last name */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-300 mb-1 block">First Name</label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => set("firstName", e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-red-400"
            />
          </div>
          <div>
            <label className="text-xs text-gray-300 mb-1 block">Last Name</label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => set("lastName", e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-red-400"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-xs text-gray-300 mb-1 block">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-red-400 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        {/* Contact number */}
        <div>
          <label className="text-xs text-gray-300 mb-1 block">Contact number</label>
          <input
            type="tel"
            placeholder="+(94) xx xxx xxxx"
            value={form.contactNumber}
            onChange={(e) => set("contactNumber", e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-red-400 placeholder:text-gray-400"
          />
        </div>

        {/* Become an artist toggle */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm text-gray-300">Want to share your work?</p>
          <button
            type="button"
            onClick={() => set("role", form.role === "artist" ? "user" : "artist")}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition border ${
              form.role === "artist"
                ? "bg-red-500 border-red-500 text-white"
                : "bg-white/10 border-white/30 text-gray-300"
            }`}
          >
            <span className={`w-3 h-3 rounded-full border-2 ${
              form.role === "artist" ? "bg-white border-white" : "border-gray-400"
            }`} />
            Become an artist
          </button>
        </div>

        {/* Checkboxes */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={form.receiveEmails}
              onChange={(e) => set("receiveEmails", e.target.checked)}
              className="accent-red-500"
            />
            I want to receive emails about product updates
          </label>
          <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
            <input type="checkbox" className="accent-red-500" />
            I accept{" "}
            <span className="text-red-400 underline cursor-pointer">terms of use</span>
            {" "}and{" "}
            <span className="text-red-400 underline cursor-pointer">Privacy Policy</span>
          </label>
        </div>

        {/* Error */}
        {error && <p className="text-red-400 text-xs text-center">{error}</p>}

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-full transition disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/20" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-white/20" />
        </div>

        {/* Social login */}
        <div className="flex justify-center gap-4">
          {socialButtons.map(({ Icon, label }) => (
            <button
              key={label}
              type="button"
              aria-label={`Sign up with ${label}`}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition"
            >
              <Icon size={16} />
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-red-400 font-medium hover:underline">
            Sign-in
          </Link>
        </p>
      </div>
    </AuthPageLayout>
  );
}