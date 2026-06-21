import { ClockIcon, CheckIcon, XIcon } from "lucide-react";
import type { Order, OrderStatus } from "../../types";

export default function OrderTimeLine({ order }: { order: Order }) {
  const timeline: OrderStatus[] =
    order.status === "Cancelled"
      ? order.statusHistory?.some((h) => h.status === "Confirmed")
        ? ["Placed", "Confirmed", "Cancelled"]
        : ["Placed", "Cancelled"]
      : ["Placed", "Confirmed", "Delivered"];

  const statusIcons: Record<OrderStatus, typeof ClockIcon> = {
    Placed: ClockIcon,
    Confirmed: CheckIcon,
    Delivered: CheckIcon,
    Cancelled: XIcon,
  };

  const currentIndex =
    order.status === "Cancelled"
      ? timeline.length - 1
      : timeline.indexOf(order.status);

  return (
    <div className="bg-white rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-app-green mb-6">
        Order Progress
      </h2>

      <div>
        {timeline.map((status, index) => {
          const Icon = statusIcons[status];
          const completed = index <= currentIndex;

          const historyEntry = order.statusHistory?.find(
            (h) => h.status === status,
          );

          const circleColor = completed
            ? status === "Placed"
              ? "bg-blue-100 text-blue-700"
              : status === "Confirmed"
                ? "bg-indigo-100 text-indigo-700"
                : status === "Delivered"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
            : "bg-app-cream text-app-text-light";

          const textColor = completed
            ? status === "Placed"
              ? "text-blue-700"
              : status === "Confirmed"
                ? "text-indigo-700"
                : status === "Delivered"
                  ? "text-green-700"
                  : "text-red-700"
            : "text-app-text-light";

          return (
            <div key={status} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`size-9 rounded-full flex items-center justify-center ${circleColor}`}
                >
                  <Icon className="size-4" />
                </div>

                {index < timeline.length - 1 && (
                  <div
                    className={`w-0.5 h-12 ${
                      index < currentIndex
                        ? status === "Cancelled"
                          ? "bg-red-500"
                          : "bg-app-green"
                        : "bg-app-border"
                    }`}
                  />
                )}
              </div>

              <div className="pb-6">
                <p className={`text-sm font-semibold ${textColor}`}>{status}</p>

                {historyEntry && (
                  <p className="text-xs text-app-text-light mt-1">
                    {new Date(historyEntry.timestamp).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
