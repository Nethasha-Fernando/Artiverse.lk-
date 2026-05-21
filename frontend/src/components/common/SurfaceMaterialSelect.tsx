import { useState } from "react";

const SURFACE_OPTIONS = ["Canvas", "Paper", "Wood", "Glass"];

interface SurfaceMaterialSelectProps {
  selected: string;
  onChange: (val: string) => void;
}

export default function SurfaceMaterialSelect({ selected, onChange }: SurfaceMaterialSelectProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-left
          outline-none flex justify-between items-center hover:border-red-300 transition"
      >
        <span className={selected ? "text-gray-800" : "text-gray-400"}>
          {selected || "Select here"}
        </span>
        <span className={`text-gray-400 text-xs transition-transform duration-150 ${open ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>

      {open && (
        <div className="absolute z-20 top-full left-0 right-0 bg-white border border-gray-200
          rounded-xl shadow-md mt-1 overflow-hidden">
          {SURFACE_OPTIONS.map((mat) => (
            <div
              key={mat}
              onClick={() => { onChange(mat); setOpen(false); }}
              className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-50
                ${selected === mat ? "bg-red-50 text-red-500 font-medium" : "text-gray-700"}`}
            >
              {mat}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}