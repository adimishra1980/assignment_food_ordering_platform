import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import PageHeader from "../components/PageHeader";
import type { CartItem } from "../slices/cartSlice";
import { formatIndianCurrency } from "../utils/formatIndianCurrency";

export default function CartPage() {
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const renderCartItem = (item: CartItem) => (
    <div
      key={item.id}
      className="flex items-center justify-between border-b py-4"
    >
      <div className="flex items-center gap-4">
        <img
          src={item.image_url}
          alt={item.name}
          className="w-20 h-20 object-cover rounded-md"
        />
        <div>
          <h3 className="font-bold text-lg">{item.name}</h3>
          <p className="text-gray-500">₹{item.price}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <a href=""></a>
        <p>Qty: {item.quantity}</p>
        <button className="text-red-500 hover:text-red-700 font-bold">
          Remove
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-[#E9ECEE] min-h-screen">
      <PageHeader />
      <main className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">Your Cart</h1>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
              {cartItems.map(renderCartItem)}
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md h-fit">
              <h2 className="text-2xl font-bold border-b pb-4 mb-4">
                Order Summary
              </h2>
              <div className="flex justify-between mb-2">
                <p>Subtotal</p>
                <p>{formatIndianCurrency(subtotal)}</p>
              </div>
              <div className="flex justify-between mb-4">
                <p>Taxes & Fees</p>
                <p>₹0.00</p>
              </div>
              <div className="flex justify-between font-bold text-xl border-t pt-4">
                <p>Total</p>
                <p>{formatIndianCurrency(subtotal)}</p>
              </div>
              <button className="w-full mt-6 bg-[#FF3F6C] text-white py-3 rounded-lg font-bold hover:bg-[#e0224f]">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
