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

    if ((product.stock ?? 0) <= 0) return;

    if (cartItem) {
      if (cartItem.quantity >= (product.stock ?? 0)) return;

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
          className={`w-full h-full object-contain transition duration-300 ${
            product.stock === 0
              ? "grayscale opacity-60"
              : "group-hover:scale-105"
          }`}
        />

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-20">
            <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-lg">
              Out of Stock
            </span>
          </div>
        )}

        {(product.discount ?? 0) > 0 && (
          <span className="absolute top-3 left-3 px-2 py-1 text-[10px] font-semibold bg-app-orange text-white rounded-full shadow-sm z-10">
            {product.discount}% OFF
          </span>
        )}

        <div className="absolute bottom-3 right-3 z-30">
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
                disabled={quantity >= (product.stock ?? 0)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 ${
                  quantity >= (product.stock ?? 0)
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-app-orange text-white active:scale-90 hover:opacity-90"
                }`}
              >
                <Plus className="size-4" strokeWidth={2.8} />
              </button>
            </div>
          ) : (
            <button
              onClick={handlePlus}
              disabled={(product.stock ?? 0) <= 0}
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg transition-all duration-200 ${
                (product.stock ?? 0) <= 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-app-orange text-white hover:scale-105 active:scale-95"
              }`}
            >
              <Plus className="size-5" strokeWidth={2.8} />
            </button>
          )}
        </div>
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-app-text-light">{product.unit}</p>

          <span
            className={`text-xs font-medium ${
              (product.stock ?? 0) > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            Stock: {product.stock ?? 0}
          </span>
        </div>

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
