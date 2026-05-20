import CartItem from "../components/cart/CartItem";

const cartItems = [
  {
    id: 1,
    title: "The Quiet Guardian",
    artist: "Frank Esteban",
    price: 150,
    quantity: 1,
    image: "/cart-art.jpg",
  },

  {
    id: 2,
    title: "Custom Art",
    artist: "Username",
    price: 150,
    quantity: 1,
    image: "/cart-art.jpg",
  },
];

function MyCartPage() {
  return (
    <div className="bg-[#f5f5f5] min-h-screen py-10">

      <div className="max-w-5xl mx-auto">

        {/* Title */}
        <div className="text-center mb-10">

          <h1 className="text-5xl font-bold text-red-500">
            My Cart
          </h1>

          <p className="text-gray-500 mt-3">
            View your purchased artworks and stay updated
            on their status and delivery.
          </p>
        </div>

        {/* Cart Items */}
        <div className="space-y-6">

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
    </div>
  );
}

export default MyCartPage;