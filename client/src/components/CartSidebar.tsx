import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  ArrowRightIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  Trash2Icon,
  XIcon,
  ShoppingCartIcon,
} from "lucide-react";

const CartSidebar = () => {
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "₹";

  const {
    items,
    updateQuantity,
    removeFromCart,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = isCartOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const DELIVERY_FEE = Number(import.meta.env.VITE_DELIVERY_FEE) || 50;
  const FREE_DELIVERY_THRESHOLD =
    Number(import.meta.env.VITE_FREE_DELIVERY_THRESHOLD) || 1000;
  const PLATFORM_FEE = Number(import.meta.env.VITE_PLATFORM_FEE) || 4;

  const deliveryFee = cartTotal > FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;

  const grandTotal = cartTotal + deliveryFee + PLATFORM_FEE;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-black/30 z-[9999] transition-opacity duration-300"
      />

      {/* Sidebar */}
      <div
        className="
          fixed right-0 top-0 h-full w-full sm:max-w-sm
          bg-white z-[9999] shadow-2xl flex flex-col
          animate-slide-in-right
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-app-border">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-app-orange/10 flex items-center justify-center">
              <ShoppingCartIcon className="size-4 text-app-orange" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-app-text">
                Shopping Cart
              </h2>
              <p className="text-[11px] text-app-text-light">
                {items.length} {items.length === 1 ? "item" : "items"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="size-8 rounded-lg hover:bg-app-cream flex items-center justify-center transition-colors"
          >
            <XIcon className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="size-16 rounded-full bg-app-cream flex items-center justify-center mb-4">
                <ShoppingBagIcon className="size-7 text-app-orange" />
              </div>

              <h3 className="text-base font-semibold text-app-text mb-1">
                Your cart is empty
              </h3>

              <p className="text-sm text-app-text-light max-w-[220px] leading-5">
                Add some fresh products to continue shopping.
              </p>

              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-5 px-4 py-2.5 rounded-xl bg-app-orange text-white text-sm font-medium hover:bg-app-orange-dark transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product._id}
                className="bg-white border border-app-border rounded-xl p-3 hover:shadow-md transition-all"
              >
                <div className="flex gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="size-[68px] rounded-lg object-cover border border-app-border shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-medium text-app-text line-clamp-2">
                          {item.product.name}
                        </h4>

                        <p className="text-xs text-app-text-light mt-0.5">
                          {currency}
                          {item.product.price.toFixed(2)} / {item.product.unit}
                        </p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        className="p-1.5 rounded-md hover:bg-red-50 text-app-text-light hover:text-red-500 transition-colors"
                      >
                        <Trash2Icon className="size-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center bg-app-cream rounded-lg p-1">
                        <button
                          onClick={() => {
                            if (item.quantity > 1) {
                              updateQuantity(
                                item.product._id,
                                item.quantity - 1,
                              );
                            } else {
                              removeFromCart(item.product._id);
                            }
                          }}
                          className="size-7 rounded-md bg-white flex items-center justify-center hover:bg-app-orange hover:text-white transition-colors"
                        >
                          <MinusIcon className="size-3" />
                        </button>

                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(item.product._id, item.quantity + 1)
                          }
                          className="size-7 rounded-md bg-white flex items-center justify-center hover:bg-app-orange hover:text-white transition-colors"
                        >
                          <PlusIcon className="size-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-[11px] text-app-text-light">Total</p>

                        <p className="text-sm font-semibold text-app-text">
                          {currency}
                          {(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-app-border bg-white p-4 space-y-4">
            {deliveryFee > 0 && (
              <div className="bg-app-cream rounded-xl p-3">
                <div className="flex items-center justify-between text-[11px] mb-2">
                  <span className="text-app-text-light">
                    Add{" "}
                    <span className="font-medium text-app-orange">
                      {currency}
                      {(FREE_DELIVERY_THRESHOLD - cartTotal).toFixed(2)}
                    </span>{" "}
                    more for free delivery
                  </span>

                  <span className="font-medium">
                    {Math.min(
                      (cartTotal / FREE_DELIVERY_THRESHOLD) * 100,
                      100,
                    ).toFixed(0)}
                    %
                  </span>
                </div>

                <div className="w-full h-1.5 bg-white rounded-full overflow-hidden">
                  <div
                    className="h-full bg-app-orange rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        (cartTotal / FREE_DELIVERY_THRESHOLD) * 100,
                        100,
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-app-text-light">Subtotal</span>
                <span className="font-medium">
                  {currency}
                  {cartTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-app-text-light">Delivery</span>
                <span className="font-medium">
                  {deliveryFee === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    `${currency}${deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-app-text-light">Platform Fee</span>
                <span className="font-medium">
                  {currency}
                  {PLATFORM_FEE.toFixed(2)}
                </span>
              </div>

              <div className="border-t border-app-border pt-3 flex justify-between items-center">
                <span className="text-sm font-semibold">Grand Total</span>

                <span className="text-lg font-semibold text-app-orange">
                  {currency}
                  {grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                navigate("/checkout");
                window.scrollTo(0, 0);
              }}
              className="w-full py-3 rounded-xl bg-app-orange text-white text-sm font-medium hover:bg-app-orange-dark transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Proceed to Checkout
              <ArrowRightIcon className="size-4" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
