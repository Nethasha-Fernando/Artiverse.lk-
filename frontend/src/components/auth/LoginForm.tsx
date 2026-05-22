import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { EyeIcon, EyeOffIcon } from "../../assets/icons/EyeIcons";
import SocialButtons from "./SocialButtons";

type LoginFormProps = {
  onSuccess?:    () => void;
  registerLink?: "navigate" | "modal";
};

export default function LoginForm({ onSuccess, registerLink = "navigate" }: LoginFormProps) {
  const { login } = useAuth();

  const [email,        setEmail]       = useState("");
  const [password,     setPassword]    = useState("");
  const [showPassword, setShowPass]    = useState(false);
  const [loading,      setLoading]     = useState(false);
  const [error,        setError]       = useState("");

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      // change the login call:
      const res  = await fetch("/api/auth/login", {
        method:      "POST",
        headers:     { "Content-Type": "application/json" },
        credentials: "include",  // NEW — needed to receive the httpOnly cookie
        body:        JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      login(data.accessToken, data.user); // was data.token
      onSuccess?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 text-white">
      <h2 className="text-2xl font-bold text-center">Welcome back!</h2>

      {/* Email */}
      <div>
        <label className="text-xs text-gray-300 mb-1 block">Email address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-red-400"
        />
      </div>

      {/* Password */}
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

      <SocialButtons action="Sign in" />

      <p className="text-center text-xs text-gray-400">
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          onClick={registerLink === "modal" ? onSuccess : undefined}
          className="text-red-400 font-medium hover:underline"
        >
          Sign-Up
        </Link>
      </p>
    </div>
  );
}