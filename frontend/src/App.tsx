import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import ArtworkDetailPage from "./pages/ArtworkDetailPage";
import Gallery from "./components/artwork/Gallery";
import ArtworkFilters from "./components/artwork/ArtworkFilters";
import ArtworkGrid from "./components/artwork/ArtworkGrid";
import CreateArtworkPage from "./pages/CreateArtworkPage";

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
  { label: "Charcoal", image: "/oil paiting.jpg"},
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
  const priceRange = { min: 0, max: 10000 };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/artworks"
          element={
            <div>
              <div className="categories">
                <button
                  className={`categories-btn ${showFilters ? "active" : ""}`}
                  onClick={() => setShowFilters((v) => !v)}
                >
                  <span className="menu-icon">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                  Categories
                </button>
              </div>

              <ArtworkGrid grid={grid} />

              {showFilters && (
                <ArtworkFilters
                  ArtType={ArtType}
                  Themes={Themes}
                  priceRange={priceRange}
                />
              )}

              <Gallery />
            </div>
          }
        />

        <Route path="/artworks/create" element={<CreateArtworkPage />} />
        <Route path="/artworks/:id/:slug?" element={<ArtworkDetailPage />} />
        

        {/* Redirect root → /artworks */}
        <Route path="/" element={<Navigate to="/artworks" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;



// function App() {

//  const [showFilters, setShowFilters] = useState(false);

//  const grid = [
//  { label: "Gouache", image: "/oil paiting.jpg" },
//  { label: "Tempera", image: "/oil paiting.jpg" },
//  { label: "Oil", image: "/oil paiting.jpg" },
//  { label: "Acrylic", image: "/oil paiting.jpg" },
//  { label: "Watercolor", image: "/oil paiting.jpg" },
//  { label: "Charcoal", image: "/oil paiting.jpg"},
//  { label: "Pencil", image: "/oil paiting.jpg" },
//  { label: "Ink", image: "/oil paiting.jpg" },
//];

