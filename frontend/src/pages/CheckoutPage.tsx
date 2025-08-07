import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../app/store";
import { placeOrder } from "../slices/orderSlice";
import { clearCart } from "../slices/cartSlice";
import { toast } from "react-toastify";

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { items: cartItems } = useAppSelector((state: RootState) => state.cart);
  const { status: orderStatus, currentOrderId } = useAppSelector(
    (state: RootState) => state.order
  );

  const isLoading = orderStatus === "loading";

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.phone.trim() !== "" &&
    formData.address.trim() !== "";

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid) return;

    const orderData = {
      customer: {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      },
      items: cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      })),
    };

    dispatch(placeOrder(orderData));
  }

  useEffect(() => {
    if(orderStatus === 'succeeded' && currentOrderId){
      toast.success("Order Placed Successfully")
      dispatch(clearCart())
      navigate(`order/${currentOrderId}`)
    }
  }, [currentOrderId, orderStatus, dispatch, navigate])

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <PageHeader />
      <main className="container mx-auto p-8 flex-grow">
        <h1 className="text-4xl font-bold mb-8 text-center">Checkout</h1>
        <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto flex flex-col md:flex-row gap-8">
          {/* Order summary placeholder */}
          <section className="md:w-1/2 border-r pr-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            {/* TODO: Render cart items summary here */}
            <p className="text-gray-700">
              Your selected items will appear here.
            </p>
          </section>

          {/* Checkout form */}
          <section className="md:w-1/2">
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-6">
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Full Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                  required
                  autoComplete="name"
                  disabled={isLoading}
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="phone"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Phone Number<span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1 (555) 123-4567"
                  required
                  autoComplete="tel"
                  pattern="^\+?[0-9\s\-()]{7,15}$"
                  disabled={isLoading}
                  title="Enter a valid phone number"
                />
              </div>

              <div className="mb-8">
                <label
                  htmlFor="address"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Address<span className="text-red-500">*</span>
                </label>
                <textarea
                  id="address"
                  rows={4}
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="123 Main St, Apt 4B, City, Country"
                  required
                  disabled={isLoading}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`w-full py-3 rounded-md font-bold text-white ${
                  isFormValid && !isLoading
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                } transition-colors duration-200`}
              >
                {isLoading ? "Placing Order..." : "Place Order"}
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
