import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import PageHeader from "../components/PageHeader";
import {
  decreaseQuantity,
  increaseQuantity,
  removeItemFromCart,
  type CartItem,
} from "../slices/cartSlice";
import { formatIndianCurrency } from "../utils/formatIndianCurrency";
import { Minus, Plus } from "lucide-react";
import { useAppDispatch } from "../app/hooks";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const dispatch = useAppDispatch();
  const navigate = useNavigate()

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
        <div className=" flex items-center gap-3 px-3 py-1 border border-gray-400">
          <button
            onClick={() => dispatch(decreaseQuantity(item.id))}
            className=" text-red-400"
          >
            <Minus />
          </button>
          <p className="font-semibold w-3 text-center">{item.quantity}</p>
          <button
            onClick={() => dispatch(increaseQuantity(item.id))}
            className=" text-green-500"
          >
            <Plus />
          </button>
        </div>

        <button
          onClick={() => dispatch(removeItemFromCart(item.id))}
          className="text-red-500 hover:text-red-700 font-bold"
        >
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
              <div className="flex justify-between mb-2">
                <p>Discount</p>
                <p>₹0.00</p>
              </div>
              <div className="flex justify-between mb-4">
                <p>Taxes & Fees</p>
                <p>₹0.00</p>
              </div>
              <div className="flex justify-between font-bold text-xl border-t pt-4">
                <p>Total</p>
                <p>{formatIndianCurrency(subtotal)}</p>
              </div>
              <button 
              onClick={() => navigate('/checkout')}
              className="w-full mt-6 bg-[#FF3F6C] text-white py-3 rounded-lg font-bold hover:bg-[#e0224f]">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
