import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import type { Address } from "../types";
import {
  ArrowLeft,
  CheckIcon,
  ChevronRightIcon,
  CreditCardIcon,
  InfoIcon,
  MapPinIcon,
} from "lucide-react";

import CheckoutPayment from "../components/Checkout/CheckoutPayment";
import CheckoutAddress from "../components/Checkout/CheckoutAddress";
import CheckoutReview from "../components/Checkout/CheckoutReview";
import CheckoutSummary from "../components/Checkout/CheckoutSummary";
import api from "../config/api";
import toast from "react-hot-toast";
import { useAuth } from "../context/authContext";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, cartTotal, clearCart } = useCart();

  const { user } = useAuth();

  const [step, setStep] = useState("address");
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState<Address>({
    id: "",
    label: "Home",
    address: "",
    city: "",
    state: "",
    zip: "",
    isDefault: false,
    lat: 0,
    lng: 0,
  });

  const [paymentMethod, setPaymentMethod] = useState("cash");

  const DELIVERY_FEE = Number(import.meta.env.VITE_DELIVERY_FEE) || 50;

  const FREE_DELIVERY_THRESHOLD =
    Number(import.meta.env.VITE_FREE_DELIVERY_THRESHOLD) || 1000;

  const PLATFORM_FEE = Number(import.meta.env.VITE_PLATFORM_FEE) || 4;

  const deliveryFee = cartTotal > FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;

  const total = cartTotal + deliveryFee + PLATFORM_FEE;

  const steps: {
    key: string;
    label: string;
    icon: typeof MapPinIcon;
  }[] = [
    { key: "address", label: "Address", icon: MapPinIcon },
    { key: "payment", label: "Payment", icon: CreditCardIcon },
    { key: "review", label: "Review", icon: CheckIcon },
    { key: "summary", label: "Summary", icon: InfoIcon },
  ];

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        items: items.map((item) => ({
          product: item.product.id,
          quantity: item.quantity,
        })),
        shippingAddress: address,
        paymentMethod,
      };
      const { data } = await api.post("/orders", orderData);
      console.log(data);
      // if(data.url){
      //   window.location.href = data.url;
      //   return;
      // }
      clearCart();
      toast.success("Order placed");
      navigate(`/orders/${data.order.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Failed");
    } finally {
      setLoading(false);
      scrollTo(0, 0);
    }
  };

  useEffect(() => {
    if (user?.addresses?.length) {
      const defaultAddr =
        user.addresses.find((a) => a.isDefault) || user.addresses[0];

      setAddress({
        id: defaultAddr?.id,
        label: defaultAddr?.label,
        address: defaultAddr?.address,
        city: defaultAddr?.city,
        state: defaultAddr?.state,
        zip: defaultAddr?.zip,
        isDefault: defaultAddr?.isDefault,
        lat: defaultAddr?.lat,
        lng: defaultAddr?.lng,
      });
    }
  }, []);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-app-cream flex items-center justify-center px-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-app-border">
          <h2 className="text-xl font-semibold text-app-green mb-2">
            Your cart is empty
          </h2>

          <p className="text-sm text-app-text-light mb-6">
            Add items to proceed with checkout
          </p>

          <button
            onClick={() => navigate("/products")}
            className="px-6 py-2.5 bg-app-green text-white text-sm font-medium rounded-xl hover:bg-app-green-light transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const currentStep = steps.find((s) => s.key === step);
  const CurrentIcon = currentStep?.icon || MapPinIcon;

  return (
    <div className="min-h-screen bg-app-cream">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-app-text-light hover:text-app-green mb-6 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>

        <div className="mb-10">
          <div className="flex items-center justify-between lg:hidden bg-white border border-app-border rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-medium text-app-green">
              <CurrentIcon className="size-4" />
              {currentStep?.label}
            </div>

            <span className="text-xs text-app-text-light">
              Step {steps.findIndex((s) => s.key === step) + 1} / {steps.length}
            </span>
          </div>

          <div className="hidden lg:flex flex-wrap items-center gap-3">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center gap-2">
                <button
                  onClick={() => setStep(s.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                    step === s.key
                      ? "bg-app-green text-white border-app-green"
                      : "bg-white text-app-text-light border-app-border hover:border-app-green"
                  }`}
                >
                  <s.icon className="size-4" />
                  {s.label}
                </button>

                {i < steps.length - 1 && (
                  <ChevronRightIcon className="size-4 text-app-text-light" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            {step === "address" && (
              <CheckoutAddress
                address={address}
                setAddress={setAddress}
                setStep={setStep}
                user={user}
              />
            )}

            {step === "payment" && (
              <CheckoutPayment
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                setStep={setStep}
              />
            )}

            {step === "review" && (
              <CheckoutReview
                address={address}
                items={items}
                setStep={setStep}
              />
            )}

            {step === "summary" && (
              <CheckoutSummary
                itemsSize={items.length}
                total={total}
                cartTotal={cartTotal}
                deliveryFee={deliveryFee}
                platformFee={PLATFORM_FEE}
                loading={loading}
                handlePlaceOrder={handlePlaceOrder}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
