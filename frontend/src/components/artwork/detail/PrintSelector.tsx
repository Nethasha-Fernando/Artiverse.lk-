import PrintCard from "./PrintCard";
import type { DetailPrint, DetailPrintSize } from "../../../shared/types/artworkDetail";

interface PrintSelectorProps {
  prints:           DetailPrint[];
  selectedPrintKey: string | null;
  onSelect:         (print: DetailPrint, size: DetailPrintSize) => void;
}

export default function PrintSelector({ prints, selectedPrintKey, onSelect }: PrintSelectorProps) {
  if (!prints || prints.length === 0) {
    return <p className="text-sm text-gray-500">No print options available for this artwork.</p>;
  }

  const cards = prints.flatMap((print) =>
    print.sizes.map((size) => ({ print, size }))
  );

  return (
    <div className="grid grid-cols-2 gap-2">
      {cards.map(({ print, size }) => {
        const cardKey = `${print.surfaceMaterial}-${size.width}x${size.height}`;
        return (
          <PrintCard
            key={cardKey}
            print={print}
            size={size}
            isSelected={selectedPrintKey === cardKey}
            onSelect={() => onSelect(print, size)}
          />
        );
      })}
    </div>
  );
}