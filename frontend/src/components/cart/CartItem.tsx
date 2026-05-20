type CartItemProps = {
  title: string
  artist: string
  price: number
  quantity: number
  image: string
}

function CartItem({
  title,
  artist,
  price,
  quantity,
  image
}: CartItemProps) {
  return (
    <div className="flex gap-4 border rounded-xl p-4">
      <img
        src={image}
        alt={title}
        className="w-32 h-32 object-cover rounded-lg"
      />

      <div className="flex-1">
        <h2 className="text-xl font-semibold">{title}</h2>

        <p className="text-gray-500">{artist}</p>

        <p className="font-bold mt-2">Rs. {price}</p>

        <div className="flex items-center gap-3 mt-4">
          <button className="px-3 py-1 border rounded">
            -
          </button>

          <span>{quantity}</span>

          <button className="px-3 py-1 border rounded">
            +
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartItem