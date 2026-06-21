import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { statusColors } from "../../assets/assets";
import type { Order } from "../../types";
import Loading from "../../components/Loading";
import { ArrowLeftIcon, MapPinIcon, UserIcon, LinkIcon } from "lucide-react";
import DeliveryMap from "../../components/OrderTracking/DeliveryMap";
import toast from "react-hot-toast";
import OrderTimeLine from "../../components/OrderTracking/OrderTimeLine";
import api from "../../config/api";

const AdminOrderDetails = () => {
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "₹";

  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/admin/orders/${id}`);

        setOrder(data.order);
      } catch (error) {
        navigate("/admin/orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate]);

  if (loading) return <Loading />;
  if (!order) return null;
  const copyGoogleMapsLink = async () => {
    const { lat, lng } = order.shippingAddress;

    const googleMapsLink = `https://www.google.com/maps?q=${lat},${lng}`;

    try {
      await navigator.clipboard.writeText(googleMapsLink);
      toast.success("Google Maps link copied");
    } catch {
      toast.error("Failed to copy link");
    }
  };
  return (
    <div className="min-h-screen bg-app-cream pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate("/admin/orders")}
          className="inline-flex items-center gap-2 text-sm font-medium text-app-text-light hover:text-app-green mb-6 transition-colors"
        >
          <ArrowLeftIcon className="size-4" />
          All Orders
        </button>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-app-green break-all">
              Order #{order.id.slice(-8).toUpperCase()}
            </h1>

            <p className="text-sm text-app-text-light mt-2">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          <span
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${
              statusColors[order.status] || "bg-gray-100 text-gray-700"
            }`}
          >
            {order.status}
          </span>
        </div>
        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {/* Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-app-border">
              <h3 className="text-base font-semibold text-app-green mb-4">
                Items ({order.items.length})
              </h3>

              <div className="space-y-2">
                {order.items.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-app-cream transition-colors"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="size-12 rounded-xl object-cover border border-app-border"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-app-green truncate">
                        {item.name}
                      </p>

                      <p className="text-xs text-app-text-light">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <span className="text-sm font-semibold whitespace-nowrap">
                      {currency}
                      {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-app-border space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-app-text-light">Subtotal</span>
                  <span>
                    {currency}
                    {order.subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-app-text-light">Delivery</span>
                  <span>
                    {order.deliveryFee === 0
                      ? "Free"
                      : `${currency}${order.deliveryFee.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-app-text-light">Platform Fee</span>
                  <span>
                    {currency}
                    {order.platformFee.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between pt-4 border-t border-app-border font-bold text-base text-app-green">
                  <span>Total</span>
                  <span>
                    {currency}
                    {order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-app-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-app-green flex items-center gap-2">
                  <MapPinIcon className="size-4" />
                  Delivery Address
                </h3>

                <button
                  onClick={copyGoogleMapsLink}
                  className="p-2 rounded-lg hover:bg-app-cream transition-colors"
                  title="Copy Google Maps link"
                >
                  <LinkIcon className="size-4 text-app-green" />
                </button>
              </div>

              <p className="text-sm text-app-text-light leading-relaxed break-words">
                {order.shippingAddress.label}
                <br />
                {order.shippingAddress.address}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.zip}
              </p>
            </div>

            {/* Map */}
            <DeliveryMap
              lat={order.shippingAddress.lat}
              lng={order.shippingAddress.lng}
            />
          </div>

          {/* Right Side */}
          <div className="space-y-5">
            {/* Customer Details */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-app-border">
              <h3 className="text-base font-semibold text-app-green mb-4 flex items-center gap-2">
                <UserIcon className="size-4" />
                Customer Details
              </h3>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-app-text-light">Name</p>
                  <p className="font-medium text-app-green">
                    {order.user?.name || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-app-text-light">Email</p>
                  <p className="font-medium break-all">
                    {order.user?.email || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-app-text-light">Phone</p>
                  <p className="font-medium">{order.user?.phone || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <OrderTimeLine order={order} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
