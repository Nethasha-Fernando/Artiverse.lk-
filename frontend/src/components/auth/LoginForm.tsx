import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaGoogle, FaApple, FaFacebookF } from "react-icons/fa";

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

type LoginFormProps = {
  onSuccess?: () => void;
  registerLink?: "navigate" | "modal";
};

export default function LoginForm({ onSuccess, registerLink = "navigate" }: LoginFormProps) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      login(data.token, data.user);
      onSuccess?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  const socialButtons = [
    { Icon: FaGoogle, label: "Google" },
    { Icon: FaApple, label: "Apple" },
    { Icon: FaFacebookF, label: "Facebook" },
  ];

  return (
    <div className="space-y-4 text-white">
      <h2 className="text-2xl font-bold text-center">Welcome back !</h2>

      <div>
        <label className="text-xs text-gray-300 mb-1 block">Email address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-red-400"
        />
      </div>

      <div>
        <label className="text-xs text-gray-300 mb-1 block">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-red-400 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        <div className="flex justify-end mt-1">
          <button type="button" className="text-xs text-red-400 hover:underline">
            Forgot password?
          </button>
        </div>
      </div>

      {error && <p className="text-red-400 text-xs text-center">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-full transition disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-white/20" />
        <span className="text-xs text-gray-400">or</span>
        <div className="flex-1 h-px bg-white/20" />
      </div>

      <div className="flex justify-center gap-4">
        {socialButtons.map(({ Icon, label }) => (
          <button
            key={label}
            type="button"
            aria-label={`Sign in with ${label}`}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition"
          >
            <Icon size={16} />
          </button>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400">
        Don&apos;t have an account?{" "}
        {registerLink === "navigate" ? (
          <Link to="/register" className="text-red-400 font-medium hover:underline">
            Sign-Up
          </Link>
        ) : (
          <Link
            to="/register"
            onClick={onSuccess}
            className="text-red-400 font-medium hover:underline"
          >
            Sign-Up
          </Link>
        )}
      </p>
    </div>
  );
}
