import type { Frame } from "../../../shared/types/artworkDetail";

interface FrameCardProps {
  frame:      Frame;
  isSelected: boolean;
  onSelect:   () => void;
  framePrice: number;
}

export default function FrameCard({ frame, isSelected, onSelect, framePrice }: FrameCardProps) {
  const rows = [
    { label: "Material", value: frame.material || "—" },
    { label: "Color",    value: frame.color    || "—" },
    { label: "Width",    value: frame.widthCm  ? `${frame.widthCm} cm` : "—" },
    { label: "Price",    value: `LKR ${framePrice.toLocaleString("en-LK")}.00` },
  ];

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-lg border-2 overflow-hidden transition-all ${
        isSelected
          ? "border-rose-400 shadow-sm shadow-rose-100"
          : "border-gray-200 hover:border-rose-200"
      }`}
    >
      {rows.map((row, i) => (
        <div
          key={row.label}
          className={`flex items-center justify-between px-3 py-1.5 text-xs ${
            i < rows.length - 1 ? "border-b border-gray-100" : ""
          } ${isSelected ? "bg-rose-50/60" : "bg-white"}`}
        >
          <span className="font-medium text-gray-500 w-16">{row.label}</span>
          <span className={`font-semibold ${row.label === "Price" ? "text-rose-500" : "text-gray-800"}`}>
            {row.value}
          </span>
        </div>
      ))}
    </button>
  );
}