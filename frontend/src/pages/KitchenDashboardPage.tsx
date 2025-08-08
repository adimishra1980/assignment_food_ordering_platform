import PageHeader from "../components/PageHeader";
import { rpcClient } from "../utils/rpcClient";
import type { IOrder } from "../types/type";
import { useEffect, useState } from "react";
import { formatIndianCurrency } from "../utils/formatIndianCurrency";
import { toast } from "react-toastify";

// Status badge colors
const statusColors: Record<string, string> = {
  PENDING: "bg-gray-200 text-gray-800",
  ACCEPTED: "bg-blue-200 text-blue-800",
  PREPARING: "bg-yellow-200 text-yellow-800",
  READY: "bg-green-200 text-green-800",
  COMPLETED: "bg-gray-300 text-gray-500",
};

// Returns info on next allowed kitchen action based on status
function getNextAction(status: string) {
  switch (status) {
    case "PENDING":
      return {
        label: "Accept Order",
        nextStatus: "ACCEPTED",
        action: "acceptOrder",
      };
    case "ACCEPTED":
      return {
        label: "Mark as Preparing",
        nextStatus: "PREPARING",
        action: "updateOrderStatus",
      };
    case "PREPARING":
      return {
        label: "Mark as Ready",
        nextStatus: "READY",
        action: "updateOrderStatus",
      };
    case "READY":
      return {
        label: "Mark as Completed",
        nextStatus: "COMPLETED",
        action: "updateOrderStatus",
      };
    default:
      return null;
  }
}

interface OrderUpdateParams {
  orderId: number;
  status: string;
}

function KitchenDashboard() {
  const isConnected = true; // For UI preview & status

  const [orders, setOrders] = useState<IOrder[]>([]);

  useEffect(() => {
    async function fetchInitialOrders() {
      try {
        // fetching all the orders
        const initialOrders = await rpcClient<IOrder[]>("listOrders");
        // only get orders that are not completed
        const activeOrders = initialOrders.filter(
          (order) => order.status !== "COMPLETED"
        );
        setOrders(activeOrders);
      } catch (error) {
        console.log("Failed to fetch initial orders:", error);
        
      }
    }

    fetchInitialOrders();
  }, []);

  // Placeholder action handler
  const handleStatusChange = async (
    orderId: number,
    nextStatus: string,
    actionType: string
  ) => {
    try {
      // The 'actionType' variable ('acceptOrder' or 'updateOrderStatus')

      const updatedOrder = await rpcClient<IOrder, OrderUpdateParams>(
        actionType,
        {
          orderId,
          status: nextStatus,
        }
      );
      console.log("updatedOrder", updatedOrder);

      // updating the local state
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === orderId ? updatedOrder : order))
      );
    } catch (error) {
      console.error(`Failed to ${actionType} for order ${orderId}:`, error);
      toast.error("Failed to update order status. Please try again.");
    }
  };

  return (
    <div>
      <PageHeader />
      <main className="container mx-auto p-6 min-h-screen flex flex-col">
        <div className="flex justify-evenly items-center mb-10">
          <h1 className="text-4xl font-bold text-[#FF5100]">
            KITCHEN DASHBOARD
          </h1>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              isConnected
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            ● {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
        <section className="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto w-full">
          <h2 className="text-2xl font-semibold mb-6">INCOMING ORDERS</h2>
          <div className="space-y-8">
            {orders.length > 0 ? (
              orders.map((order) => {
                const nextAction = getNextAction(order.status);
                return (
                  <div
                    key={order.id}
                    className="p-6 rounded-xl border flex flex-col md:flex-row md:justify-between md:items-center bg-gray-50 shadow transition hover:bg-blue-50"
                  >
                    {/* Main info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-xl">
                          Order #{order.id}
                        </span>
                        <span
                          className={`px-4 py-1 rounded-lg font-medium text-base capitalize ${
                            statusColors[order.status] ||
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p>
                        <span className="font-medium text-gray-700">
                          Customer:
                        </span>{" "}
                        {order.customer_name} ({order.customer_phone})
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Total:</span>{" "}
                        {formatIndianCurrency(order.total_amount)}
                      </p>
                      <p className="text-gray-600 text-sm">
                        <span className="font-medium">Placed:</span>{" "}
                        {new Date(order.created_at).toLocaleString()}
                      </p>

                      <div className="mt-4">
                        <p className="font-semibold mb-1 text-gray-800">
                          Items:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700">
                          {order.items.map((item) => (
                            <li key={item.menu_item_id}>
                              {item.name}{" "}
                              <span className="text-gray-500">
                                x {item.quantity}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    {/* Action section */}
                    <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
                      {nextAction ? (
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded transition shadow font-semibold"
                          onClick={() =>
                            handleStatusChange(
                              order.id,
                              nextAction.nextStatus,
                              nextAction.action
                            )
                          }
                        >
                          {nextAction.label}
                        </button>
                      ) : (
                        <span className="text-gray-500 font-semibold text-sm mt-2">
                          No further action
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center">
                No new orders yet. Waiting for incoming orders…
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default KitchenDashboard;
