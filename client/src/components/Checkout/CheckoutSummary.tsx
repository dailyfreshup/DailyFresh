import { InfoIcon } from "lucide-react";

interface CheckoutSummaryProps {
  itemsSize: number;
  total: number;
  cartTotal: number;
  deliveryFee: number;
  platformFee: number;
  loading: boolean;
  handlePlaceOrder: () => void;
}

export default function CheckoutSummary({
  itemsSize,
  total,
  cartTotal,
  deliveryFee,
  platformFee,
  loading,
  handlePlaceOrder,
}: CheckoutSummaryProps) {
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "$";

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-app-border animate-fade-in">
      <h2 className="text-base font-semibold text-app-green mb-5 flex items-center gap-2">
        <InfoIcon className="size-5" />
        Order Summary
      </h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-app-text-light">
            Subtotal ({itemsSize} items)
          </span>
          <span className="font-medium">
            {currency}
            {cartTotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-app-text-light">Delivery</span>

          <span className="font-medium">
            {deliveryFee === 0 ? (
              <span className="text-app-success font-semibold">Free</span>
            ) : (
              `${currency}${deliveryFee.toFixed(2)}`
            )}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-app-text-light">Platform Fee</span>

          <span className="font-medium">
            {currency}
            {platformFee.toFixed(2)}
          </span>
        </div>

        <div className="pt-4 mt-4 border-t border-app-border flex justify-between text-base font-semibold">
          <span>Total</span>

          <span className="text-app-green">
            {currency}
            {total.toFixed(2)}
          </span>
        </div>
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={loading}
        className="w-full mt-6 py-3 bg-app-orange text-white font-semibold rounded-xl hover:bg-app-orange-dark transition-colors disabled:opacity-60 active:scale-[0.98]"
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
}
