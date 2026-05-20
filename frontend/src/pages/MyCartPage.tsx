import CartItem from "../components/cart/CartItem"

const cartItems = [
  {
    id: 1,
    title: "Abstract Art",
    artist: "John Doe",
    price: 5000,
    quantity: 1,
    image: "/cart-art.jpg"
  }
]

function MyCartPage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        My Cart
      </h1>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <CartItem
            key={item.id}
            title={item.title}
            artist={item.artist}
            price={item.price}
            quantity={item.quantity}
            image={item.image}
          />
        ))}
      </div>
    </div>
  )
}

export default MyCartPage