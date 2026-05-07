import { useState } from "react";
// ArtworkFilters.jsx
type PriceRange = {
  min: number;
  max: number;
};

type ArtworkFiltersProps = {
  ArtType: Record<string, string[]>; // 👈 This means it's an object like: { Painting: ["Oil", "Acrylic"] }
  Themes: string[]; // 👈 An array of strings like ["Nature", "Buildings"]
  priceRange: PriceRange; // 👈 A nested object with `min` and `max` numbers {min:jwehwu,max:skjs}
};

function ArtworkFilters({ ArtType, Themes, priceRange }: ArtworkFiltersProps) {
  //const [openCategory, setOpenCategory] = useState(null);
  //const [selectedArtType,setSelectedArtType]=useState([]);
  //const [searchQuery, setSearchQuery] = useState("");
  //const [selectedThemes,setSelectedThemes]=useState([]);
  //const [selectedMinPrice,setSelectedMinPrice]=useState(0)
  //const [selectedMaxPrice,setSelectedMaxPrice]=useState(10000)

  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [selectedArtType, setSelectedArtType] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [selectedMinPrice, setSelectedMinPrice] = useState<number>(0);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState<number>(10000);

  //const toggleCategory = (category) => {
  const toggleCategory = (category: string) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  // NEW: toggle a theme in/out of selection
  //const toggleTheme = (t) => {
  const toggleTheme = (t: string) => {
    if (selectedThemes.includes(t)) {
      setSelectedThemes(selectedThemes.filter((x) => x !== t));
    } else {
      setSelectedThemes([...selectedThemes, t]);
    }
  };

  //  const visible = Themes.filter(t =>
  //    t.toLowerCase().includes(searchQuery.toLowerCase())
  //  );

  //  const ordered = [
  //  ...visible.filter(t => selectedThemes.includes(t)),   // selected first
  //  ...visible.filter(t => !selectedThemes.includes(t)),  // then the rest
  //];

  const visible: string[] = Themes.filter((t) =>
    t.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ordered: string[] = [
    ...visible.filter((t) => selectedThemes.includes(t)),
    ...visible.filter((t) => !selectedThemes.includes(t)),
  ];

  const categoryItems = Object.keys(ArtType).map((category) => (
    <div key={category}>
      <h4 onClick={() => toggleCategory(category)}>
        {category} {openCategory === category ? "▲" : "▼"}
      </h4>

      {openCategory === category && (
        <div>
          {ArtType[category].map((type) => (
            <p key={type}>{type}</p>
          ))}
        </div>
      )}
    </div>
  ));

  return (
    <div className="art-filters">
      <h1>Art Categories</h1>
      <h2>Art Type</h2>
      <div className="art-type">{categoryItems}</div>
      <div className="themes">
        <input
          placeholder="Type something here..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <ul>
          {visible.length ? (
            ordered.map((theme) => (
              <li key={theme}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedThemes.includes(theme)}
                    onChange={() => toggleTheme(theme)}
                  />
                  {theme}
                </label>
              </li>
            ))
          ) : (
            <li>No matches</li>
          )}
        </ul>
      </div>

      <div className="price-range">
        <h2>Price range</h2>

        {/* 1) Simple inputs that stay in bounds */}
        <div className="price-inputs">
          <label>
            Min
            <input
              type="number"
              value={selectedMinPrice}
              onChange={(e) => {
                let v = Number(e.target.value);
                if (Number.isNaN(v)) return; // ignore bad input

                if (v < priceRange.min) v = priceRange.min;
                if (v > selectedMaxPrice) v = selectedMaxPrice;
                setSelectedMinPrice(v);
              }}
              min={priceRange.min}
              max={selectedMaxPrice}
            />
          </label>

          <label>
            Max
            <input
              type="number"
              value={selectedMaxPrice}
              onChange={(e) => {
                let v = Number(e.target.value);
                if (Number.isNaN(v)) return;
                if (v > priceRange.max) v = priceRange.max;
                if (v < selectedMinPrice) v = selectedMinPrice;
                setSelectedMaxPrice(v);
              }}
              min={selectedMinPrice}
              max={priceRange.max}
            />
          </label>
        </div>

        {/* 2) Live values (updates as you type/drag) */}
        <div className="price-labels">
          <span>${selectedMinPrice.toLocaleString()}</span>
          <span>${selectedMaxPrice.toLocaleString()}</span>
        </div>

        {/* 3) One bar with two thumbs */}
        <div className="dual-range">
          <div className="track" />
          <div
            className="range"
            style={{
              left: `${
                ((selectedMinPrice - priceRange.min) /
                  (priceRange.max - priceRange.min)) *
                100
              }%`,
              width: `${
                ((selectedMaxPrice - selectedMinPrice) /
                  (priceRange.max - priceRange.min)) *
                100
              }%`,
            }}
          />

          {/* left thumb controls Min (can't pass Max) */}
          <input
            type="range"
            min={priceRange.min}
            max={priceRange.max}
            value={selectedMinPrice}
            onChange={(e) => {
              const v = Number(e.target.value);
              setSelectedMinPrice(v > selectedMaxPrice ? selectedMaxPrice : v);
            }}
          />

          {/* right thumb controls Max (can't go below Min) */}
          <input
            type="range"
            min={priceRange.min}
            max={priceRange.max}
            value={selectedMaxPrice}
            onChange={(e) => {
              const v = Number(e.target.value);
              setSelectedMaxPrice(v < selectedMinPrice ? selectedMinPrice : v);
            }}
          />
        </div>
      </div>
    </div>
  );
}
export default ArtworkFilters;
