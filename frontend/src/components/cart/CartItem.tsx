type CartItemProps = {
  title: string;
  artist: string;
  price: number;
  quantity: number;
  image: string;
};

function CartItem({
  title,
  artist,
  price,
  quantity,
  image,
}: CartItemProps) {
  return (
    <div className="flex items-center gap-6 bg-white rounded-2xl shadow-md p-5 border border-gray-100">

      {/* Checkbox */}
      <input
        type="checkbox"
        className="w-5 h-5 accent-red-500"
      />

      {/* Artwork Image */}
      <img
        src={image}
        alt={title}
        className="w-28 h-28 rounded-xl object-cover"
      />

      {/* Artwork Details */}
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-gray-900">
          {title}
        </h2>

        <p className="text-gray-500 text-sm mt-1">
          by {artist}
        </p>

        <div className="mt-3 text-sm text-gray-500 space-y-1">
          <p>Art: Oil on Canvas</p>
          <p>Frame: Wooden black frame</p>
        </div>

        <button className="text-red-500 text-sm mt-3">
          Remove Item
        </button>
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-3">

        <button className="w-8 h-8 border rounded-md">
          -
        </button>

        <span className="font-medium">
          {quantity}
        </span>

        <button className="w-8 h-8 border rounded-md">
          +
        </button>
      </div>

      {/* Price */}
      <div className="text-right">
        <p className="text-red-500 font-bold text-lg">
          LKR {price}.00
        </p>
      </div>
    </div>
  );
}

export default CartItem;