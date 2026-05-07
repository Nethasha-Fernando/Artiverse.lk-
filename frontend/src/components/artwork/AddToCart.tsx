export default function AddToCart({
  total,
  onAdd,
}: {
  total: number;
  onAdd?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onAdd ?? (() => {})}
      className="w-full mt-4 bg-red-500 text-white py-3 rounded-xl hover:bg-red-600"
    >
      Add to cart • LKR {total.toLocaleString("en-LK")}
    </button>
  );
}
