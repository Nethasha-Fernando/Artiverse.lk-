import type { DetailPrint, DetailPrintSize } from "../../../shared/types/artworkDetail";

interface PrintCardProps {
  print:      DetailPrint;
  size:       DetailPrintSize;
  isSelected: boolean;
  onSelect:   () => void;
}

export default function PrintCard({ print, size, isSelected, onSelect }: PrintCardProps) {
  const rows = [
    { label: "Material", value: print.surfaceMaterial },
    { label: "Size",     value: `${size.width} x ${size.height} cm` },
    { label: "Price",    value: `LKR ${size.price.toLocaleString("en-LK")}.00` },
  ];

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-lg border-2 overflow-hidden transition-all ${
        isSelected
          ? "border-red-400 shadow-sm shadow-red-100"
          : "border-gray-200 hover:border-red-200"
      }`}
    >
      {rows.map((row, i) => (
        <div
          key={row.label}
          className={`flex items-center justify-between px-3 py-1.5 text-xs ${
            i < rows.length - 1 ? "border-b border-gray-100" : ""
          } ${isSelected ? "bg-red-50/60" : "bg-white"}`}
        >
          <span className="font-medium text-gray-500 w-16">{row.label}</span>
          <span className={`font-semibold ${row.label === "Price" ? "text-red-500" : "text-gray-800"}`}>
            {row.value}
          </span>
        </div>
      ))}
    </button>
  );
}