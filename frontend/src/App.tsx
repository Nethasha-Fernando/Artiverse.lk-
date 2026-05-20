import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import LandingPage from "./pages/LandingPage";

// Only artists can access this route
function ArtistRoute({ children }: { children: React.ReactNode }) {
  const { isArtist } = useAuth();
  return isArtist ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/artworks" element={<Gallery />} />

        {/* Auth routes */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected route */}
        <Route
          path="/artworks/create"
          element={
            <ArtistRoute>
              <CreateArtworkPage />
            </ArtistRoute>
          }
        />

        {/* Details page */}
        <Route
          path="/artworks/:id/:slug?"
          element={<ArtworkDetailPage />}
        />

        {/* Artists */}
        <Route path="/artists" element={<ArtistsPage />} />
        <Route path="/artists/:id" element={<ArtistProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;