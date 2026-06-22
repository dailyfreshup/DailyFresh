import { useNavigate, useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import type { Product } from "../types";
import Loading from "../components/Loading";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import api from "../config/api";

const ProductPage = () => {
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "₹";

  const { id } = useParams();
  const navigate = useNavigate();

  const { items, addToCart, updateQuantity, removeFromCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // window.scrollTo({
        //   top: 0,
        //   behavior: "smooth",
        // });

        const { data } = await api.get(`/products/${id}`);

        setProduct(data.product);

        const relatedRes = await api.get("/products", {
          params: {
            category: data.product.category,
          },
        });

        setRelatedProducts(
          relatedRes.data.products
            .filter((p: Product) => p.id !== data.product.id)
            .slice(0, 5),
        );
      } catch (error) {
        console.error(error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);
  if (loading) return <Loading />;
  if (!product) return null;
  const cartItem = items.find((item) => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;
  const discount = product.discount ?? 0;
  const categoryLabel = product.category.replace(/-/g, " ");
  const handlePlus = () => {
    if (cartItem) {
      updateQuantity(product.id, cartItem.quantity + 1);
    } else {
      addToCart(product, 1);
    }
  };
  const handleMinus = () => {
    if (!cartItem) return;

    if (cartItem.quantity > 1) {
      updateQuantity(product.id, cartItem.quantity - 1);
    } else {
      removeFromCart(product.id);
    }
  };
  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm text-app-text-light hover:text-app-green transition-colors"
      >
        <ArrowLeftIcon className="size-4" />
        Back
      </button>

      <div className="bg-white rounded-3xl border border-app-border overflow-hidden shadow-sm">
        <div className="grid md:grid-cols-2 gap-10 items-center p-6 md:p-10">
          <div className="relative bg-app-cream rounded-2xl flex items-center justify-center p-8 min-h-[360px]">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-[320px] object-contain hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm capitalize text-app-text-light mb-2 tracking-wide">
                {categoryLabel}
              </p>

              <h1 className="text-3xl md:text-4xl font-bold text-app-green leading-tight">
                {product.name}
              </h1>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-app-cream text-sm font-medium text-app-green border border-app-border">
                {product.unit}
              </span>

              {discount > 0 && (
                <span className="px-3 py-1 rounded-full bg-app-orange/10 text-app-orange text-sm font-semibold">
                  Save {discount}%
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-app-green">
                {currency}
                {product.price.toFixed(2)}
              </span>

              {product.originalPrice > product.price && (
                <span className="text-lg text-app-text-light line-through">
                  {currency}
                  {product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <div className="border-t border-app-border pt-5">
              <h3 className="text-sm font-semibold text-app-green uppercase tracking-wide mb-2">
                Description
              </h3>

              <p className="text-app-text-light leading-7 text-[15px]">
                {product.description}
              </p>
            </div>

            <div className="pt-2">
              {cartItem ? (
                <div className="w-fit flex items-center border border-app-border rounded-xl overflow-hidden">
                  <button
                    onClick={handleMinus}
                    className="p-3 hover:bg-app-cream transition"
                  >
                    <MinusIcon className="w-4 h-4" />
                  </button>

                  <span className="w-12 text-center font-semibold">
                    {quantity}
                  </span>

                  <button
                    onClick={handlePlus}
                    className="p-3 hover:bg-app-cream transition"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="w-full sm:w-fit py-3 px-6 rounded-xl font-medium flex items-center justify-center gap-2 transition-all active:scale-[0.98] bg-app-orange hover:bg-app-orange-dark text-white"
                >
                  <ShoppingCartIcon className="w-4 h-4" />
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-14">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-app-green">
                Related Products
              </h2>

              <p className="text-sm text-app-text-light mt-1">
                More from {categoryLabel}
              </p>
            </div>

            <Link
              to={`/products?category=${product.category}`}
              className="flex items-center gap-1 text-sm font-medium text-app-green hover:underline"
            >
              View All
              <ArrowRightIcon className="size-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {relatedProducts.map((rp) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductPage;
