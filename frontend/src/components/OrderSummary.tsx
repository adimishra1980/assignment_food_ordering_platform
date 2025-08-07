// src/components/OrderSummary.tsx
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { formatIndianCurrency } from "../utils/formatIndianCurrency";

export default function OrderSummary() {
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <section className="md:w-1/2 md:border-r md:pr-8">
      <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
      <div className="space-y-4 mb-6">
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-md"
              />
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
            </div>
            <p className="font-semibold">
              {formatIndianCurrency(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between">
          <p className="text-gray-600">Subtotal</p>
          <p className="font-semibold">₹{subtotal.toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-600">Taxes & Fees</p>
          <p className="font-semibold">₹0.00</p>
        </div>
        <div className="flex justify-between font-bold text-lg mt-2">
          <p>Total</p>
          <p>₹{formatIndianCurrency(subtotal)}</p>
        </div>
      </div>
    </section>
  );
}
