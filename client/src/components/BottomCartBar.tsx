import { ShoppingCartIcon, ArrowRightIcon } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

const BottomCartBar = () => {
  const { cartCount, setIsCartOpen, isCartOpen } = useCart();
  const location = useLocation();

  const show =
    cartCount > 0 &&
    !isCartOpen &&
    (location.pathname === "/" || location.pathname === "/products");

  return (
    <button
      onClick={() => setIsCartOpen(true)}
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
      disabled={!show}
      className={`
    md:hidden
    fixed
    bottom-7
    left-4
    right-4
    md:left-1/2
    md:-translate-x-1/2
    md:max-w-sm
    z-[999]
    rounded-full
    bg-app-green
    text-white
    shadow-xl
    px-4
    py-2.5
    flex
    items-center
    justify-between
    active:scale-95

    transition-all
    duration-300
    ease-out
    transform

    ${
      show
        ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
        : "opacity-0 translate-y-6 scale-95 pointer-events-none"
    }
  `}
    >
      <div className="flex items-center gap-3">
        <div className="size-9 rounded-full bg-white/15 flex items-center justify-center">
          <ShoppingCartIcon className="size-4.5" />
        </div>

        <div className="text-left leading-tight">
          <p className="text-sm font-semibold">
            {cartCount} {cartCount === 1 ? "item" : "items"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-sm font-medium">
        View Cart
        <ArrowRightIcon className="size-4" />
      </div>
    </button>
  );
};

export default BottomCartBar;
