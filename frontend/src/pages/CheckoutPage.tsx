import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../app/store";
import { placeOrder } from "../slices/orderSlice";
import { clearCart } from "../slices/cartSlice";
import { toast } from "react-toastify";
import OrderSummary from "../components/OrderSummary";

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // for tracking fields have been touched to show errors only after interaction
  const [touched, setTouched] = useState({
    name: false,
    phone: false,
    address: false,
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { items: cartItems } = useAppSelector((state: RootState) => state.cart);
  const { status: orderStatus, currentOrderId } = useAppSelector(
    (state: RootState) => state.order
  );

  const isLoading = orderStatus === "loading";

  // Validation rules
  const errors = {
    name: !formData.name.trim() ? "Name is required." : "",
    phone: !formData.phone.trim()
      ? "Phone number is required."
      : !/^\+?[0-9\s\-()]{10,15}$/.test(formData.phone)
      ? "Enter a valid phone number."
      : "",
    address: !formData.address.trim() ? "Address is required." : "",
  };

  const isFormValid = !errors.name && !errors.address && !errors.phone;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  }

  function handleBlur(
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { id } = e.target;
    setTouched((prev) => ({ ...prev, [id]: true }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid) {
      // Mark all fields as touched to show errors on submit if invalid
      setTouched({ name: true, phone: true, address: true });
      return;
    }

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
    if (orderStatus === "succeeded" && currentOrderId) {
      dispatch(clearCart());
      navigate(`/order/${currentOrderId}`);
      toast.success("Order Placed Successfully");
    }
  }, [currentOrderId, orderStatus, dispatch, navigate]);

  // Style for error messages
  const errorClass = "text-red-600 text-sm mt-1";

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <PageHeader />
      <main className="container mx-auto p-8 flex-grow">
        <h1 className="text-4xl font-bold mb-8 text-center">Checkout</h1>
        <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto flex flex-col md:flex-row gap-8">
          {/* Order Summary */}
          <OrderSummary />

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
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    touched.name && errors.name
                      ? "border-red-600 focus:ring-red-600"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="John Doe"
                  required
                  autoComplete="name"
                  disabled={isLoading}
                />
                {touched.name && errors.name && (
                  <p className={errorClass}>{errors.name}</p>
                )}
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
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    touched.phone && errors.phone
                      ? "border-red-600 focus:ring-red-600"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="+1 (555) 123-4567"
                  required
                  autoComplete="tel"
                  pattern="^\+?[0-9\s\-()]{7,15}$"
                  disabled={isLoading}
                  title="Enter a valid phone number"
                />
                {touched.phone && errors.phone && (
                  <p className={errorClass}>{errors.phone}</p>
                )}
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
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    touched.address && errors.address
                      ? "border-red-600 focus:ring-red-600"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="123 Main St, Apt 4B, City, Country"
                  required
                  disabled={isLoading}
                ></textarea>
                {touched.address && errors.address && (
                  <p className={errorClass}>{errors.address}</p>
                )}
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
