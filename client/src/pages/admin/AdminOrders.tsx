import { useState, useEffect } from "react";
import Loading from "../../components/Loading";
import api from "../../config/api";
import toast from "react-hot-toast";
import { ChevronRightIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

type OrderStatus = "Placed" | "Confirmed" | "Delivered" | "Cancelled";

export default function AdminOrders() {
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "$";

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<"All" | OrderStatus>(
    "All",
  );
  const navigate = useNavigate();
  const filteredOrders =
    selectedStatus === "All"
      ? orders
      : orders.filter((order) => order.status === selectedStatus);
  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders/all");
      setOrders(data.orders);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusOptions = (currentStatus: OrderStatus) => {
    switch (currentStatus) {
      case "Placed":
        return ["Placed", "Confirmed", "Cancelled"];

      case "Confirmed":
        return ["Confirmed", "Delivered", "Cancelled"];

      case "Delivered":
        return ["Delivered"];

      case "Cancelled":
        return ["Cancelled"];

      default:
        return [currentStatus];
    }
  };

  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus,
  ) => {
    // Keep previous orders in case API fails
    const previousOrders = [...orders];

    // Instant UI update
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
            }
          : order,
      ),
    );

    try {
      await api.put(`/orders/${orderId}/status`, {
        status: newStatus,
      });

      toast.success("Order status updated");
    } catch (error: any) {
      // Rollback UI
      setOrders(previousOrders);

      toast.error(error.response?.data?.message || "Failed to update order");
    }
  };

  const statusColors: Record<OrderStatus, string> = {
    Placed: "bg-blue-100 text-blue-700",
    Confirmed: "bg-indigo-100 text-indigo-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-app-border overflow-hidden">
      <div className="px-6 py-5 border-b border-app-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold text-zinc-900">Orders</h2>

        <select
          value={selectedStatus}
          onChange={(e) =>
            setSelectedStatus(e.target.value as "All" | OrderStatus)
          }
          className="rounded-lg border border-app-border px-4 py-2 text-sm outline-none focus:border-app-green"
        >
          <option value="All">All Orders</option>
          <option value="Placed">Placed</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-app-cream/50 text-zinc-500 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Order Details</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-app-border">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-zinc-50 transition-colors"
                >
                  {/* Order */}
                  <td className="px-6 py-4">
                    <p className="font-semibold text-zinc-900">
                      #{order.id.slice(-6)}
                    </p>

                    <p className="text-xs text-zinc-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </td>

                  {/* Customer */}
                  <td className="px-6 py-4">
                    <p className="font-medium text-zinc-900">
                      {order.user?.name || "Unknown User"}
                    </p>

                    <p className="text-xs text-zinc-500">
                      {order.user?.email || "No email"}
                    </p>

                    <p className="text-xs text-zinc-500">
                      {order.user?.phone || "No phone"}
                    </p>
                  </td>

                  {/* Total */}
                  <td className="px-6 py-4 font-medium text-zinc-900">
                    {currency}
                    {Number(order.total).toFixed(2)}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-between gap-3">
                      {order.status === "Delivered" ||
                      order.status === "Cancelled" ? (
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${
                            statusColors[order.status as OrderStatus]
                          }`}
                        >
                          {order.status}
                        </span>
                      ) : (
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(
                              order.id,
                              e.target.value as OrderStatus,
                            )
                          }
                          onClick={(e) => e.stopPropagation()}
                          className={`rounded-lg px-3 py-2 text-xs font-semibold outline-none border border-transparent cursor-pointer transition ${
                            statusColors[order.status as OrderStatus]
                          }`}
                        >
                          {getStatusOptions(order.status as OrderStatus).map(
                            (status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ),
                          )}
                        </select>
                      )}

                      <button
                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                        className="size-8 rounded-full border border-app-border flex items-center justify-center hover:bg-app-cream transition"
                      >
                        <ChevronRightIcon className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
