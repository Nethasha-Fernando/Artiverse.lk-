import { useState } from "react";
import "../../css/artwork-grid.css";

type GridItem = {
  label: string;
  image?: string;
};

type ArtworkGridProps = {
  grid: GridItem[];
};

function ArtworkGrid({ grid }: ArtworkGridProps) {
  const visibleCount = 5; // how many to show
  const middleIndex = Math.floor(visibleCount / 2); // 2 → 3rd slot is middle

  //const [selectedIndex, setSelectedIndex] = useState(middleIndex);
  const [selectedIndex, setSelectedIndex] = useState<number>(middleIndex);

  // go left
  const handlePrev = () => {
    if (selectedIndex > 0) setSelectedIndex(selectedIndex - 1);
  };

  // go right
  const handleNext = () => {
    if (selectedIndex < grid.length - 1) setSelectedIndex(selectedIndex + 1);
  };

  return (
    <div className="artwork-grid">
      <button className="arrow-left" onClick={handlePrev}>
        ❮
      </button>

      <div className="grid-items">
        {Array.from({ length: visibleCount }, (_, slotIndex) => {
          const actualIndex = selectedIndex - middleIndex + slotIndex;

          // ghost slot if out of bounds
          if (actualIndex < 0 || actualIndex >= grid.length) {
            return (
              <div key={`ghost-${slotIndex}`} style={{ width: "140px" }}></div>
            );
          }

          // real slot
          const item = grid[actualIndex];
          const distance = Math.abs(actualIndex - selectedIndex); // 👈 distance from center

          return (
            <button
              key={`${item.label}-${actualIndex}`}
              className={`artwork-item distance-${distance}`}
              onClick={() => setSelectedIndex(actualIndex)}
              type="button"
            >
              {/* <button
              key={item.label}
              className={`artwork-item distance-${distance}`}
              onClick={() => setSelectedIndex(actualIndex)}
            > */}

              {item.image && <img src={item.image} alt={item.label} />}
              <div>{item.label}</div>
            </button>
          );
        })}
      </div>

      <button className="arrow-right" onClick={handleNext}>
        ❯
      </button>
    </div>
  );
}

export default ArtworkGrid;
