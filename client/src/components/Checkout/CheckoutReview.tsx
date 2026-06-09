import { CheckIcon, ChevronRightIcon, TruckIcon } from "lucide-react";
import type { Address } from "../../types";
import type { Dispatch, SetStateAction } from "react";

interface CheckoutReviewProps {
  setStep: Dispatch<SetStateAction<string>>;
  address: Address;
  items: any[];
}

export default function CheckoutReview({
  address,
  items,
  setStep,
}: CheckoutReviewProps) {
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "$";

  return (
    <div className="bg-white rounded-2xl p-6 animate-fade-in">
      <h2 className="text-lg font-semibold text-app-green mb-5 flex items-center gap-2">
        <CheckIcon className="size-5" /> Review Your Order
      </h2>

      <div className="mb-5 p-4 bg-app-cream rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <TruckIcon className="size-4 text-app-green" />
          <span className="text-sm font-semibold text-app-green">
            Delivery Address
          </span>
        </div>
        <p className="text-sm text-app-text-light">
          {address.label} — {address.address}, {address.city}, {address.state}{" "}
          {address.zip}
        </p>
      </div>

      <div className="space-y-3 mb-5">
        {items.map((item) => (
          <div key={item.product._id} className="flex items-center gap-3">
            <img
              src={item.product.image}
              alt={item.product.name}
              className="size-12 rounded-lg object-cover"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-app-green">
                {item.product.name}
              </p>
              <p className="text-xs text-app-text-light">
                Qty: {item.quantity}
              </p>
            </div>
            <span className="text-sm font-semibold">
              {currency}
              {(item.product.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          setStep("summary");
          scrollTo(0, 0);
        }}
        className="mt-6 px-6 py-3 bg-app-green text-white font-semibold rounded-xl hover:bg-app-green-light transition-colors flex items-center gap-2"
      >
        Continue <ChevronRightIcon className="size-4" />
      </button>
    </div>
  );
}
