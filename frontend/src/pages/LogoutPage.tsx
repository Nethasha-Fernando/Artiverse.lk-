import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthPageLayout from "../components/auth/AuthPageLayout";

export default function LogoutPage() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout(); // now async but fire-and-forget is fine here
  }, [logout]);

  return (
    <AuthPageLayout>
      <div className="space-y-5 text-center text-white">
        <h1 className="text-2xl font-bold">
          {user ? `Goodbye, ${user.firstName}` : "Signed out"}
        </h1>
        <p className="text-sm text-gray-300">
          You have been signed out of Artiverse.
        </p>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-full transition"
          >
            Sign in again
          </button>
          <Link to="/artworks" className="text-sm text-red-400 hover:underline">
            Continue browsing artworks
          </Link>
        </div>
      </div>
    </AuthPageLayout>
  );
}
