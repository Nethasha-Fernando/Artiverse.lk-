import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";import { ALL_CATEGORY_LABEL,
  CATEGORY_GRID_ITEMS, } from "../../shared/constants/artCategories";
type AuthPageLayoutProps = {
  children: ReactNode;
  compact?: boolean;
};

export default function AuthPageLayout({ children, compact = false }: AuthPageLayoutProps) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 h-screen w-screen overflow-hidden flex items-center justify-center">
      {/* Background image removed to avoid missing asset error; gradient overlay kept */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/40" />

      <div className="relative z-10 w-full max-w-md mx-4 flex flex-col shrink-0">
        <Link
          to="/"
          className="inline-block mb-2 text-xs text-white/80 hover:text-white transition shrink-0"
        >
          ← Back to home
        </Link>
        <div
          className={`bg-black/55 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 overflow-hidden ${
            compact ? "p-5" : "p-8"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
