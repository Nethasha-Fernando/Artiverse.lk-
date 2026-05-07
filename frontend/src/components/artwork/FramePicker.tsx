import { useEffect, useState } from "react";

/*
  Very simple types so it's easy to read.
  These match what your backend can send later.
*/
type SimpleOption = {
  id: string;      // value we save (e.g., "wood")
  label: string;   // text we show (e.g., "Wood")
  adder?: number;  // optional extra price for this option
};

type WidthOption = {
  id: string;            // e.g., "2"
  label: string;         // e.g., "2 cm"
  units?: number;        // e.g., 2
  adderPerUnit?: number; // e.g., 10  => price = units * adderPerUnit
};

/*
  Config = the options the artist/DB will provide.
  For now, we also set a SIMPLE default so the component
  can work *even before* you connect the backend.
*/
type FramePickerConfig = {
  base?: number;            // base fee if a frame is selected
  materials: SimpleOption[]; // wood/metal etc.
  colors: SimpleOption[];    // black/gold etc.
  widths: WidthOption[];     // 1 cm / 2 cm / 3 cm
};

type Props = {
  // If you don’t pass config, we use a safe default.
  config?: FramePickerConfig;

  // Tell the parent the current frame price (number).
  onPriceChange: (price: number) => void;

  // (Optional) tell the parent what the user selected.
  onChange?: (selection: { material: string; color: string; width: string }) => void;
};

export default function FramePicker({ config, onPriceChange, onChange }: Props) {
  // 1) fallback config so it works before backend
  const cfg: FramePickerConfig = config ?? {
    base: 100,
    materials: [
      { id: "wood",  label: "Wood",  adder: 40 },
      { id: "metal", label: "Metal", adder: 60 },
    ],
    colors: [
      { id: "black",  label: "Black" },
      { id: "gold",   label: "Gold" },
      { id: "walnut", label: "Walnut" },
    ],
    widths: [
      { id: "1", label: "1 cm", units: 1, adderPerUnit: 10 },
      { id: "2", label: "2 cm", units: 2, adderPerUnit: 10 },
      { id: "3", label: "3 cm", units: 3, adderPerUnit: 10 },
    ],
  };

  // 2) what the user picked
  const [material, setMaterial] = useState("");
  const [color, setColor]       = useState("");
  const [width, setWidth]       = useState("");

  // 3) helper: find price parts from current selection
  function calculatePrice(): number {
    // if no material yet, treat as "no frame selected"
    if (!material) return 0;

    const base = cfg.base ?? 0;

    // find material extra
    const materialAdder =
      cfg.materials.find(m => m.id === material)?.adder ?? 0;

    // find width extra
    const w = cfg.widths.find(w => w.id === width);
    const widthAdder = (w?.units ?? 0) * (w?.adderPerUnit ?? 0);

    // color usually free — but if you add adder later, it will work
    const colorAdder =
      cfg.colors.find(c => c.id === color)?.adder ?? 0;

    return base + materialAdder + widthAdder + colorAdder;
  }

  // 4) whenever the selection changes, update price + notify parent
  useEffect(() => {
    const price = calculatePrice();
    onPriceChange(price);

    // also tell parent the selection (if they care)
    onChange?.({ material, color, width });
  }, [material, color, width]); // runs when any select changes

  return (
    <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 space-y-3">
      {/* MATERIAL */}
      <div>
        <label className="block text-sm font-medium">Frame Material</label>
        <select
          className="w-full p-2 border rounded-md"
          value={material}
          onChange={(e) => {
            setMaterial(e.target.value);
            // reset others when material changes (simple UX)
            setColor("");
            setWidth("");
          }}
        >
          <option value="">Select material</option>
          {cfg.materials.map(m => (
            <option key={m.id} value={m.id}>
              {m.label}{m.adder ? ` (+${m.adder})` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* COLOR */}
      <div>
        <label className="block text-sm font-medium">Color</label>
        <select
          className="w-full p-2 border rounded-md"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          disabled={!material} // pick material first
        >
          <option value="">Select color</option>
          {cfg.colors.map(c => (
            <option key={c.id} value={c.id}>
              {c.label}{c.adder ? ` (+${c.adder})` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* WIDTH */}
      <div>
        <label className="block text-sm font-medium">Width (cm)</label>
        <select
          className="w-full p-2 border rounded-md"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
          disabled={!material}
        >
          <option value="">Select width</option>
          {cfg.widths.map(w => (
            <option key={w.id} value={w.id}>
              {w.label}
              {/* shows the extra cost so user understands */}
              {w.adderPerUnit && w.units ? ` (+${w.adderPerUnit * w.units})` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* helper text */}
      <p className="text-sm text-red-600 font-medium">
        {material
          ? `Frame price will be added to total.`
          : "Pick a material to see frame options and price."}
      </p>
    </div>
  );
}
