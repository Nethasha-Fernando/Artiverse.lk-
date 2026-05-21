import { useState, useEffect } from "react";
import { ALL_CATEGORY_LABEL } from "../../shared/constants/artCategories";

type GridItem = { label: string; image?: string };

type ArtworkGridProps = {
  grid:           readonly GridItem[];  // ← add readonly here
  selectedLabel?: string | null;
  onSelect?:      (label: string) => void;
};

export default function ArtworkGrid({
  grid,
  selectedLabel = ALL_CATEGORY_LABEL,
  onSelect,
}: ArtworkGridProps) {
  const visibleCount  = 5;
  const middleIndex   = Math.floor(visibleCount / 2);
  const defaultIndex  = Math.max(0, grid.findIndex((g) => g.label === ALL_CATEGORY_LABEL));

  const [selectedIndex, setSelectedIndex] = useState<number>(
    defaultIndex >= 0 ? defaultIndex : middleIndex
  );

  useEffect(() => {
    const idx = grid.findIndex((g) => g.label === selectedLabel);
    if (idx >= 0) setSelectedIndex(idx);
  }, [selectedLabel, grid]);

  const handlePrev = () => {
    if (selectedIndex > 0) setSelectedIndex(selectedIndex - 1);
  };

  const handleNext = () => {
    if (selectedIndex < grid.length - 1) setSelectedIndex(selectedIndex + 1);
  };

  const sizeCls = (distance: number) => {
    if (distance === 0) return "basis-[200px] h-[150px] border-[3px] border-[#ff4d4d] shadow-[0px_5px_30px_rgba(255,92,92,0.6)]";
    if (distance === 1) return "basis-[170px] h-[130px]";
    if (distance === 2) return "basis-[150px] h-[110px]";
    return "basis-[130px] h-[90px]";
  };

  const titleCls = (distance: number) => {
    if (distance === 0) return "bottom-[10px] left-1/2 -translate-x-1/2 text-[1.5rem]";
    if (distance === 1) return "bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 text-[1.3rem]";
    if (distance === 2) return "bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 text-[1.1rem]";
    return "bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 text-[1rem]";
  };

  return (
    <div className="w-screen flex items-center justify-between bg-transparent px-10 py-8 box-border">
      {/* Left Arrow */}
      <button
        className="bg-white border-2 border-[#ff4d4d] text-[#ff4d4d] rounded-full w-10 h-10 text-[18px] flex items-center justify-center transition hover:bg-[#ff4d4d] hover:text-white"
        onClick={handlePrev}
        type="button"
        aria-label="Previous"
      >
        ❮
      </button>

      {/* Items */}
      <div className="flex justify-center items-center gap-10 flex-1 overflow-hidden">
        {Array.from({ length: visibleCount }, (_, slotIndex) => {
          const actualIndex = selectedIndex - middleIndex + slotIndex;

          if (actualIndex < 0 || actualIndex >= grid.length) {
            return <div key={`ghost-${slotIndex}`} className="basis-[140px]" />;
          }

          const item     = grid[actualIndex];
          const distance = Math.abs(actualIndex - selectedIndex);
          const isCenter = distance === 0;

          return (
            <button
              key={`${item.label}-${actualIndex}`}
              type="button"
              onClick={() => {
                setSelectedIndex(actualIndex);
                onSelect?.(item.label);
              }}
              className={[
                "relative overflow-hidden cursor-pointer rounded-[12px] transition-all duration-300 ease-linear",
                "shrink-0 grow-0 border-0",
                sizeCls(distance),
                "hover:shadow-[0px_5px_30px_rgba(255,92,92,0.75)] hover:-translate-y-[5px]",
              ].join(" ")}
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.label}
                  className="absolute inset-0 w-full h-full object-cover rounded-[12px] z-0"
                />
              )}
              <div
                className={[
                  "absolute text-white font-bold text-center pointer-events-none",
                  "transition-colors duration-300",
                  isCenter ? "" : "drop-shadow-[0_2px_5px_rgba(0,0,0,0.7)]",
                  titleCls(distance),
                ].join(" ")}
              >
                {item.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Right Arrow */}
      <button
        className="bg-white border-2 border-[#ff4d4d] text-[#ff4d4d] rounded-full w-10 h-10 text-[18px] flex items-center justify-center transition hover:bg-[#ff4d4d] hover:text-white"
        onClick={handleNext}
        type="button"
        aria-label="Next"
      >
        ❯
      </button>
    </div>
  );
}