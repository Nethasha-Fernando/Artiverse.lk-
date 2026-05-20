import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import ArtworkDetailPage from "./pages/ArtworkDetailPage";
import Gallery           from "./components/artwork/Gallery";
import CreateArtworkPage from "./pages/CreateArtworkPage";
import RegisterPage      from "./pages/RegisterPage";
import LoginPage         from "./pages/LoginPage";
import LandingPage       from "./pages/LandingPage";

// Only artists can access this route
function ArtistRoute({ children }: { children: React.ReactNode }) {
  const { isArtist } = useAuth();
  return isArtist ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/"        element={<LandingPage />} />
        <Route path="/artworks" element={<Gallery />} />

        {/* Static routes must come before dynamic :id ones */}
        <Route
          path="/artworks/create"
          element={
            <ArtistRoute>
              <CreateArtworkPage />
            </ArtistRoute>
          }
        />
        <Route path="/artworks/:id/:slug?" element={<ArtworkDetailPage />} />

        {/* Auth */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login"    element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;