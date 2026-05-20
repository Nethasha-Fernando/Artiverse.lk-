import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import React from "react";

import Header from "./components/common/header";
import { useAuth } from "./context/AuthContext";

import ArtworkDetailPage from "./pages/ArtworkDetailPage";
import Gallery from "./components/artwork/Gallery";
import CreateArtworkPage from "./pages/CreateArtworkPage";
import ArtistsPage from "./pages/ArtistsPage";
import ArtistProfilePage from "./pages/ArtistProfilePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import LandingPage from "./pages/LandingPage";

const AUTH_PATHS = ["/login", "/register", "/logout"];

function ArtistRoute({ children }: { children: React.ReactNode }) {
  const { isArtist } = useAuth();
  return isArtist ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppContent() {
  const { pathname } = useLocation();
  const hideHeader = AUTH_PATHS.includes(pathname);

  return (
    <>
      {!hideHeader && <Header />}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/artworks" element={<Gallery />} />

        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<LogoutPage />} />

        <Route
          path="/artworks/create"
          element={
            <ArtistRoute>
              <CreateArtworkPage />
            </ArtistRoute>
          }
        />

        <Route
          path="/artworks/:id/:slug?"
          element={<ArtworkDetailPage />}
        />

        <Route path="/artists" element={<ArtistsPage />} />
        <Route path="/artists/:id" element={<ArtistProfilePage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
