import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import type { IOrder } from "../types/type";
import { rpcClient } from "../utils/rpcClient";
import { toast } from "react-toastify";

// ✅ Visual status tracker
const StatusTracker = ({ status }: { status: string }) => {
  const statuses = ["PENDING", "ACCEPTED", "PREPARING", "READY", "COMPLETED"];
  const currentIndex = statuses.indexOf(status);

  return (
    <div className="flex justify-between items-center my-10 px-4">
      {statuses.map((s, index) => (
        <div key={s} className="flex-1 text-center">
          <div
            className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-lg font-bold ${
              index <= currentIndex
                ? "bg-green-500 text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            {index < currentIndex ? "✔" : "●"}
          </div>
          <p
            className={`mt-2 text-xs md:text-sm ${
              index <= currentIndex
                ? "font-semibold text-gray-800"
                : "text-gray-500"
            }`}
          >
            {s}
          </p>
        </div>
      ))}
    </div>
  );
};

export default function OrderStatus() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // ✅ Fetch order details when page loads
  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      try {
        const data = await rpcClient<IOrder, {orderId: number}>("getOrderStatus", {
          orderId: Number(orderId),
        });
        setOrder(data);
      } catch (error) {
        console.error("Failed to fetch order:", error);
        toast.error("Failed to load order.");
      }
    };
    fetchOrder();
  }, [orderId]);

  // ✅ WebSocket for live updates
  useEffect(() => {
    if (!orderId) return;

    const ws = new WebSocket("ws://localhost:8000/ws");

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (
        message.type === "order_updated" &&
        message.payload.id === Number(orderId)
      ) {
        setOrder(message.payload);
        toast.info(
          `Order #${orderId} status updated to ${message.payload.status}`
        );
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => ws.close();
  }, [orderId]);

  if (!order) {
    return (
      <div>
        <PageHeader />
        <main className="container mx-auto p-8">
          <p className="text-center text-gray-500">Loading order...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <PageHeader />
      <main className="container mx-auto p-8">
        <div className="bg-white p-6 md:p-10 rounded-xl shadow-lg max-w-3xl mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold mb-2">Order Tracker</h1>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                isConnected
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              ● {isConnected ? "Live" : "Offline"}
            </span>
          </div>
          <p className="text-gray-500 mb-6">Order ID: #{order.id}</p>

          <StatusTracker status={order.status} />

          <div className="text-center mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-lg text-blue-800">
              Your order is currently{" "}
              <span className="font-bold uppercase">{order.status}</span>.
            </p>
            <p className="text-blue-600 mt-2">
              We'll update this page as soon as the status changes.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
