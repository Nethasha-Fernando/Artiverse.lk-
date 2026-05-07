export default function PriceSummaryArtwork({
  artPrice,
  framePrice,
}: {
  artPrice: number;
  framePrice: number;
}) {
  const total = artPrice + framePrice;
  const fmt = (n: number) => `LKR ${n.toLocaleString("en-LK")}`;

  return (
    <div className="text-sm space-y-1">
      <div className="flex justify-between">
        <span>Original Art</span>
        <span>{fmt(artPrice)}</span>
      </div>
      {framePrice > 0 && (
        <div className="flex justify-between">
          <span>Frame</span>
          <span>{fmt(framePrice)}</span>
        </div>
      )}
      <div className="flex justify-between font-semibold border-t pt-2">
        <span>Total</span>
        <span className="text-red-600">{fmt(total)}</span>
      </div>
    </div>
  );
}
