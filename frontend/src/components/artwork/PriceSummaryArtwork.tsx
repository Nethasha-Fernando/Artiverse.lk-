// src/components/artwork/PriceSummaryArtwork.tsx

type Props = {
  artPrice:   number;
  framePrice: number;
  edition:    "original" | "prints";
};

export default function PriceSummaryArtwork({ artPrice, framePrice, edition }: Props) {
  const total    = artPrice + framePrice;
  const fmt      = (n: number) => `LKR ${n.toLocaleString("en-LK")}`;
  const artLabel = edition === "original" ? "Original Art" : "Print";

  return (
    <div className="text-sm space-y-1">
      <div className="flex justify-between">
        <span>{artLabel}</span>
        <span>{fmt(artPrice)}</span>
      </div>
      {framePrice > 0 && (
        <div className="flex justify-between text-gray-600">
          <span>Frame</span>
          <span>{fmt(framePrice)}</span>
        </div>
      )}
      <div className="flex justify-between font-semibold border-t pt-2 mt-1">
        <span>Total</span>
        <span className="text-red-600">{fmt(total)}</span>
      </div>
    </div>
  );
}