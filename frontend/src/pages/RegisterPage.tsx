import { Link } from "react-router-dom";
import { useRegister } from "../hooks/useRegister";
import { EyeIcon, EyeOffIcon } from "../assets/icons/EyeIcons";
import AuthPageLayout from "../components/auth/AuthPageLayout";
import SocialButtons  from "../components/auth/SocialButtons";

export default function RegisterPage() {
  const r = useRegister();

  return (
    <AuthPageLayout>
      <div className="space-y-4 text-white">
        <h1 className="text-2xl font-bold text-center">Create an account</h1>

        {/* Email */}
        <div>
          <label className="text-xs text-gray-300 mb-1 block">Email address</label>
          <input
            type="email"
            value={r.form.email}
            onChange={(e) => r.set("email", e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-red-400 placeholder:text-gray-400"
          />
        </div>

        {/* First + Last name */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-300 mb-1 block">First Name</label>
            <input
              type="text"
              value={r.form.firstName}
              onChange={(e) => r.set("firstName", e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-red-400"
            />
          </div>
          <div>
            <label className="text-xs text-gray-300 mb-1 block">Last Name</label>
            <input
              type="text"
              value={r.form.lastName}
              onChange={(e) => r.set("lastName", e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-red-400"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-xs text-gray-300 mb-1 block">Password</label>
          <div className="relative">
            <input
              type={r.showPassword ? "text" : "password"}
              value={r.form.password}
              onChange={(e) => r.set("password", e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-red-400 pr-10"
            />
            <button
              type="button"
              onClick={() => r.setShowPassword(!r.showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              aria-label={r.showPassword ? "Hide password" : "Show password"}
            >
              {r.showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        {/* Contact number */}
        <div>
          <label className="text-xs text-gray-300 mb-1 block">Contact number</label>
          <input
            type="tel"
            placeholder="+(94) xx xxx xxxx"
            value={r.form.contactNumber}
            onChange={(e) => r.set("contactNumber", e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-red-400 placeholder:text-gray-400"
          />
        </div>

        {/* Become an artist toggle */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm text-gray-300">Want to share your work?</p>
          <button
            type="button"
            onClick={r.toggleRole}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition border ${
              r.form.role === "artist"
                ? "bg-red-500 border-red-500 text-white"
                : "bg-white/10 border-white/30 text-gray-300"
            }`}
          >
            <span className={`w-3 h-3 rounded-full border-2 ${
              r.form.role === "artist" ? "bg-white border-white" : "border-gray-400"
            }`} />
            Become an artist
          </button>
        </div>

        {/* Checkboxes */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={r.form.receiveEmails}
              onChange={(e) => r.set("receiveEmails", e.target.checked)}
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

        {r.error && <p className="text-red-400 text-xs text-center">{r.error}</p>}

        <button
          type="button"
          onClick={r.handleSubmit}
          disabled={r.loading}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-full transition disabled:opacity-60"
        >
          {r.loading ? "Creating account..." : "Create account"}
        </button>

        <SocialButtons action="Sign up" />

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