import { useNavigate } from "react-router-dom";
import type { Product } from "../types";
import { Minus, Plus } from "lucide-react";
import { useCart } from "../context/CartContext";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "₹";

  const { items, addToCart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const cartItem = items.find((item) => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const handlePlus = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (cartItem) {
      updateQuantity(product.id, cartItem.quantity + 1);
    } else {
      addToCart(product, 1);
    }
  };

  const handleMinus = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!cartItem) return;

    if (cartItem.quantity > 1) {
      updateQuantity(product.id, cartItem.quantity - 1);
    } else {
      removeFromCart(product.id);
    }
  };

  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      className="bg-white rounded-2xl border border-zinc-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
    >
      <div className="relative aspect-square bg-app-cream/30 p-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
        />

        {(product.discount ?? 0) > 0 && (
          <span className="absolute top-3 left-3 px-2 py-1 text-[10px] font-semibold bg-app-orange text-white rounded-full shadow-sm">
            {product.discount}% OFF
          </span>
        )}

        <div className="absolute bottom-3 right-3 z-10">
          {cartItem ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center h-11 px-1.5 rounded-full bg-white border border-app-orange/20 shadow-lg shrink-0 backdrop-blur-sm"
            >
              <button
                onClick={handleMinus}
                className="w-8 h-8 rounded-full bg-app-orange text-white flex items-center justify-center transition-all duration-150 active:scale-90 hover:opacity-90"
              >
                <Minus className="size-4" strokeWidth={2.8} />
              </button>

              <div className="min-w-[42px] px-3 flex items-center justify-center">
                <span className="text-sm font-bold text-app-orange tracking-wide">
                  {quantity}
                </span>
              </div>

              <button
                onClick={handlePlus}
                className="w-8 h-8 rounded-full bg-app-orange text-white flex items-center justify-center transition-all duration-150 active:scale-90 hover:opacity-90"
              >
                <Plus className="size-4" strokeWidth={2.8} />
              </button>
            </div>
          ) : (
            <button
              onClick={handlePlus}
              className="w-10 h-10 rounded-full bg-app-orange text-white flex items-center justify-center shrink-0 shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Plus className="size-5" strokeWidth={2.8} />
            </button>
          )}
        </div>
      </div>

      <div className="p-3">
        <p className="text-xs text-app-text-light mb-1">{product.unit}</p>

        <h3 className="text-sm font-medium text-zinc-800 line-clamp-2 min-h-[40px] leading-5">
          {product.name}
        </h3>

        <div className="mt-3 flex flex-col">
          <span className="text-lg font-semibold text-zinc-900 leading-none">
            {currency}
            {product.price.toFixed(0)}
          </span>

          {product.originalPrice > product.price && (
            <span className="text-xs text-app-text-light line-through mt-1">
              {currency}
              {product.originalPrice.toFixed(0)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
