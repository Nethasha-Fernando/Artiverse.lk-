import { useEffect, useState } from "react";

type Props = {
  onPriceChange: (price: number) => void;
};

export default function FramePicker({ onPriceChange }: Props) {
  const [material, setMaterial] = useState("");
  const [color, setColor] = useState("");
  const [width, setWidth] = useState("");

  function calculatePrice() {
    if (!material) return 0;

    let price = 100; // base frame price

    // material
    if (material === "wood") price += 40;
    if (material === "metal") price += 60;

    // color (optional future pricing)
    if (color === "gold") price += 20;

    // width
    if (width === "1") price += 10;
    if (width === "2") price += 20;
    if (width === "3") price += 30;

    return price;
  }

  useEffect(() => {
    onPriceChange(calculatePrice());
  }, [material, color, width]);

  return (
    <div className="p-4 border rounded-lg space-y-3 bg-rose-50">

      {/* MATERIAL */}
      <select
        className="w-full p-2 border rounded"
        value={material}
        onChange={(e) => {
          setMaterial(e.target.value);
          setColor("");
          setWidth("");
        }}
      >
        <option value="">Select material</option>
        <option value="wood">Wood</option>
        <option value="metal">Metal</option>
      </select>

      {/* COLOR */}
      <select
        className="w-full p-2 border rounded"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        disabled={!material}
      >
        <option value="">Select color</option>
        <option value="black">Black</option>
        <option value="gold">Gold</option>
      </select>

      {/* WIDTH */}
      <select
        className="w-full p-2 border rounded"
        value={width}
        onChange={(e) => setWidth(e.target.value)}
        disabled={!material}
      >
        <option value="">Select width</option>
        <option value="1">1 cm</option>
        <option value="2">2 cm</option>
        <option value="3">3 cm</option>
      </select>

      <p className="text-sm text-red-500">
        Frame price will be added automatically
      </p>
    </div>
  );
}