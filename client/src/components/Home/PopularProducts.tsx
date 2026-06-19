import { useEffect, useState } from "react";
import type { Product } from "../../types";
import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../ProductCard";
import api from "../../config/api";
import toast from "react-hot-toast";
import Loading from "../Loading";

const PopularProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/products?popular=true&limit=10")
      .then(({ data }) => {
        setProducts(data.products);
      })
      .catch((error: any) => {
        toast.error(error.response?.data?.message || error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return (
    <section className="pb-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">Popular Products</h2>

          <Link
            to="/products"
            className="text-sm font-semibold text-app-orange hover:text-app-orange-dark flex items-center gap-1 transition-colors"
          >
            View All <ArrowRightIcon className="size-4" />
          </Link>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 xl:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularProducts;
