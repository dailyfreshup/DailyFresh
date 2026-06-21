import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import type { Order } from "../types";
import { Link, useSearchParams } from "react-router-dom";
import { statusColors } from "../assets/assets";
import Loading from "../components/Loading";
import { CalendarIcon, ChevronRightIcon, PackageIcon } from "lucide-react";
import api from "../config/api";
import toast from "react-hot-toast";

const MyOrders = () => {
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "₹";

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();

  const { clearCart } = useCart();

  const fetchOrders = async () => {
    setLoading(true);

    try {
      const { data } = await api.get("/orders");
      setOrders(data.orders);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch orders",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeOrders = async () => {
      if (searchParams.get("clearCart")) {
        clearCart();
        setSearchParams({});
      }

      await fetchOrders();
    };

    initializeOrders();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-app-cream mb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-app-green mb-6">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <PackageIcon className="size-16 text-app-border mx-auto mb-4" />

            <h2 className="text-lg font-medium text-app-green mb-2">
              No orders yet
            </h2>

            <p className="text-sm text-app-text-light mb-4">
              Start shopping to see your orders here
            </p>

            <Link
              to="/products"
              className="inline-flex px-4 py-2 bg-app-green text-white text-sm rounded-lg"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="block max-w-4xl bg-white rounded-2xl p-5 hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-app-green">
                        Order #{order.id.slice(-8).toUpperCase()}
                      </p>

                      <div className="flex items-center gap-2 mt-1 text-xs text-app-text-light">
                        <CalendarIcon className="size-3.5" />

                        <span>
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          statusColors[order.status] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.status}
                      </span>

                      <ChevronRightIcon className="size-4 text-app-text-light" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto">
                    {order.items.slice(0, 4).map((item, index) => (
                      <img
                        key={index}
                        src={item.image}
                        alt={item.name}
                        className="size-14 sm:size-16 rounded-xl object-cover border border-app-border flex-shrink-0"
                      />
                    ))}

                    {order.items.length > 4 && (
                      <div className="size-14 sm:size-16 rounded-xl bg-app-cream flex items-center justify-center text-xs font-semibold text-app-text-light border border-app-border flex-shrink-0">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-app-border text-sm">
                    <span className="text-app-text-light">
                      {order.items.length} items
                    </span>

                    <span className="font-semibold text-app-green">
                      {currency}
                      {order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
