import React, { useState, useEffect } from "react";
import { ALL_CATEGORY_LABEL } from "../../constants/artCategories";

type GridItem = {
  // here we say that the each item in the grid (griditem) should have a label of data type string and so on, also we do this bcz in typescript we do it also it makes sure that the comp knows what type of data type each should have..
  label: string;
  image?: string;
};

type ArtworkGridProps = {
  grid: GridItem[];
  selectedLabel?: string | null;
  onSelect?: (label: string) => void;
};

function ArtworkGrid({ grid, selectedLabel = ALL_CATEGORY_LABEL, onSelect }: ArtworkGridProps) {
  const visibleCount = 5;
  const middleIndex = Math.floor(visibleCount / 2);
  const defaultIndex = Math.max(0, grid.findIndex((g) => g.label === ALL_CATEGORY_LABEL));
  const [selectedIndex, setSelectedIndex] = useState<number>(
    defaultIndex >= 0 ? defaultIndex : middleIndex,
  );

  useEffect(() => {
    const idx = grid.findIndex((g) => g.label === selectedLabel);
    if (idx >= 0) setSelectedIndex(idx);
  }, [selectedLabel, grid]);

  const handlePrev = () => {
    // what this does is it checks if the selected index>0 if so sets the selected Index using usestate to selectedindex +1 so basically if the user presses the left arrow this function is called and selected the nect index so if initllay 1 was selected now its 0..
    if (selectedIndex > 0) setSelectedIndex(selectedIndex - 1);
  };

  const handleNext = () => {
    //same thing when the right arrow is pressed this function will be called and checks if seledted index eg 2 < gridlenght(5) yes slet seletced index to 2+1 =3..
    if (selectedIndex < grid.length - 1) setSelectedIndex(selectedIndex + 1);
  };

  // size classes based on distance from center
  const sizeCls = (distance: number) => {
    //distance 0 = middle       distance 1 = next to the middle   etc  //styles the size of the card
    if (distance === 0)
      return "basis-[200px] h-[150px] border-[3px] border-[#ff4d4d] shadow-[0px_5px_30px_rgba(255,92,92,0.6)]";
    if (distance === 1) return "basis-[170px] h-[130px]";
    if (distance === 2) return "basis-[150px] h-[110px]";
    return "basis-[130px] h-[90px]"; // distance 3+
  }; // So basically we are doing this since the cards have diffeent sizes from the moddle to the end...so we have to do different styling middle, next to it etc

  const titleCls = (distance: number) => {
    // same thing but styles the titles in those grids...
    if (distance === 0)
      return "bottom-[10px] left-1/2 -translate-x-1/2 text-[1.5rem]";
    if (distance === 1)
      return "bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 text-[1.3rem]";
    if (distance === 2)
      return "bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 text-[1.1rem]";
    return "bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 text-[1rem]";
  };

  return (
    <div className="w-screen flex items-center justify-between bg-transparent px-10 py-8 box-border">
      {/* Left Arrow */}
      <button
        className="bg-white border-2 border-[#ff4d4d] text-[#ff4d4d] rounded-full w-10 h-10 text-[18px] flex items-center justify-center transition hover:bg-[#ff4d4d] hover:text-white"
        onClick={handlePrev} //so when left arrow is pressed it goes to the handle prev funtion
        type="button"
        aria-label="Previous"
      >
        ❮
      </button>

      {/* Items */}
      <div className="flex justify-center items-center gap-10 flex-1 overflow-hidden">
        {Array.from({ length: visibleCount }, (_, slotIndex) => {
          // loops ovee visible slots (5) so we create an array like [0, 1, 2, 3, 4] and For each slot, we figure out which actual card (from the full grid list) should be displayed in that spot.

          const actualIndex = selectedIndex - middleIndex + slotIndex; // figures out which item to show

          // ghost spacer
          if (actualIndex < 0 || actualIndex >= grid.length) {
            return <div key={`ghost-${slotIndex}`} className="basis-[140px]" />; // Adds empty space if item doesn’t exist
          }

          const item = grid[actualIndex];
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
              {item.image && ( // checks if each item has a image and a label if so styong is done..
                <img
                  src={item.image}
                  alt={item.label}
                  className="absolute inset-0 w-full h-full object-cover rounded-[12px] z-0"
                />
              )}

              {/* Title overlay */}
              <div
                className={[
                  "absolute text-white font-bold text-center pointer-events-none",
                  "transition-colors duration-300",
                  isCenter ? "" : "drop-shadow-[0_2px_5px_rgba(0,0,0,0.7)]",
                  titleCls(distance),
                ].join(" ")} //checks if the item is center if its center calls titleCls(distance) function
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
        onClick={handleNext} //when right arrow is pressed the handleNext funtion is called
        type="button"
        aria-label="Next"
      >
        ❯
      </button>
    </div>
  );
}

export default ArtworkGrid;
