import { ClockIcon, CheckIcon, XIcon } from "lucide-react";

export default function OrderTimeLine({ order }: { order: any }) {
  const allStatuses = ["Placed", "Confirmed", "Delivered"];

  const currentIdx =
    order.status === "Cancelled"
      ? allStatuses.length - 1
      : allStatuses.indexOf(order.status);

  const statusIcons: Record<string, any> = {
    Placed: ClockIcon,
    Confirmed: CheckIcon,
    Delivered: CheckIcon,
    Cancelled: XIcon,
  };

  // Special UI for cancelled orders
  if (order.status === "Cancelled") {
    const historyEntry = order.statusHistory?.find(
      (h: any) => h.status === "Cancelled",
    );

    return (
      <div className="bg-white rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-app-green mb-6">
          Order Status
        </h2>

        <div className="flex gap-4">
          <div className="size-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
            <XIcon className="size-5" />
          </div>

          <div>
            <p className="font-semibold text-red-700">Cancelled</p>

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
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-app-green mb-6">
        Order Progress
      </h2>

      <div className="space-y-0">
        {allStatuses.map((status, i) => {
          const Icon = statusIcons[status];
          const isCompleted = i <= currentIdx;

          const historyEntry = order.statusHistory?.find(
            (h: any) => h.status === status,
          );

          return (
            <div key={status} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`size-9 rounded-full flex items-center justify-center shrink-0 ${
                    isCompleted
                      ? status === "Placed"
                        ? "bg-blue-100 text-blue-700"
                        : status === "Confirmed"
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-green-100 text-green-700"
                      : "bg-app-cream text-app-text-light"
                  }`}
                >
                  <Icon className="size-4" />
                </div>

                {i < allStatuses.length - 1 && (
                  <div
                    className={`w-0.5 h-12 ${
                      i < currentIdx ? "bg-app-green" : "bg-app-border"
                    }`}
                  />
                )}
              </div>

              <div className="pb-6">
                <p
                  className={`text-sm font-semibold ${
                    isCompleted
                      ? status === "Placed"
                        ? "text-blue-700"
                        : status === "Confirmed"
                          ? "text-indigo-700"
                          : "text-green-700"
                      : "text-app-text-light"
                  }`}
                >
                  {status}
                </p>

                {historyEntry && (
                  <p className="text-xs text-app-text-light mt-0.5">
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
