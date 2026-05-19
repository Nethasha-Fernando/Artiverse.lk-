import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Header from "./components/common/header";

import ArtworkDetailPage from "./pages/ArtworkDetailPage";
import Gallery from "./components/artwork/Gallery";
import ArtworkFilters from "./components/artwork/ArtworkFilters";
import ArtworkGrid from "./components/artwork/ArtworkGrid";
import CreateArtworkPage from "./pages/CreateArtworkPage";
import ArtistsPage from "./pages/ArtistsPage";

type GridItem = {
  label: string;
  image?: string;
};

type ArtTypeMap = Record<string, string[]>;

function App() {
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const grid: GridItem[] = [
    { label: "Gouache", image: "/oil paiting.jpg" },
    { label: "Tempera", image: "/oil paiting.jpg" },
    { label: "Oil", image: "/oil paiting.jpg" },
    { label: "Acrylic", image: "/oil paiting.jpg" },
    { label: "Watercolor", image: "/oil paiting.jpg" },
    { label: "Charcoal", image: "/oil paiting.jpg" },
    { label: "Pencil", image: "/oil paiting.jpg" },
    { label: "Ink", image: "/oil paiting.jpg" },
  ];

  const ArtType: ArtTypeMap = {
    Painting: ["Oil", "Acrylic", "Watercolor", "Gouache", "Tempera"],
    Drawing: ["Pencil", "Charcoal", "Ink"],
    DigitalArt: ["3D", "Vector", "Pixel"],
    Sculpture: ["Stone", "Wood", "Metal"],
  };

  const Themes: string[] = ["Animals", "Nature", "Buildings", "Women"];

  const priceRange = {
    min: 0,
    max: 10000,
  };

  return (
    <BrowserRouter>
      {/* Navbar/Header */}
      <Header />

      {/* Routes */}
      <Routes>
        <Route
          path="/artworks"
          element={
            <div>
              <Gallery />
            </div>
          }
        />

        <Route
          path="/artworks/create"
          element={<CreateArtworkPage />}
        />

        <Route
          path="/artists"
          element={<ArtistsPage />}
        />

        <Route
          path="/artworks/:id/:slug?"
          element={<ArtworkDetailPage />}
        />

        {/* Redirect root → /artworks */}
        <Route
          path="/"
          element={<Navigate to="/artworks" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;