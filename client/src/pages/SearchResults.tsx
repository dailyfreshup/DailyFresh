import { useEffect, useState } from "react";
import type { Product } from "../types";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import Loading from "../components/Loading";
import ProductCard from "../components/ProductCard";
import MobileSearch from "../components/MobileSearch";
import toast from "react-hot-toast";
import api from "../config/api";

const SearchResults = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";

  useEffect(() => {
    const search = query.trim();

    if (!search) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    api
      .get("/products", {
        params: {
          search,
        },
      })
      .then(({ data }) => {
        setProducts(data.products);
      })
      .catch((error: any) => {
        toast.error(error.response?.data?.message || error.message);
        setProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [query]);

  return (
    <div className="min-h-screen bg-app-cream">
      <MobileSearch />
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-app-green mb-1">
              {query ? `Results for "${query}"` : "Search Products"}
            </h1>

            <p className="text-sm text-app-text-light">
              {!query
                ? "Search for products above."
                : loading
                  ? "Searching..."
                  : `${products.length} item${products.length !== 1 ? "s" : ""} found`}
            </p>
          </div>
          {query && (
            <Link
              to="/products"
              className="rounded-lg border border-app-border bg-white px-4 py-2 text-sm font-medium text-app-green transition hover:bg-app-green hover:text-white"
            >
              Clear Search
            </Link>
          )}
        </div>

        {!query ? (
          <div className="text-center py-20">
            <Search className="size-16 text-app-border mx-auto mb-4" />

            <h2 className="text-xl font-semibold text-app-green mb-2">
              Start Searching
            </h2>

            <p className="text-sm text-app-text-light">
              Enter a product name in the search box above.
            </p>
          </div>
        ) : loading ? (
          <Loading />
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Search className="size-16 text-app-border mx-auto mb-4" />

            <h2 className="text-xl font-semibold text-app-green mb-2">
              No results found
            </h2>

            <p className="text-sm text-app-text-light mb-6 max-w-md mx-auto">
              We couldn't find any products matching "{query}".
            </p>

            <Link
              to="/products"
              className="inline-flex px-5 py-2.5 bg-app-green text-white text-sm font-medium rounded-lg"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div
            className="
              grid
              grid-cols-2
              sm:grid-cols-3
              md:grid-cols-4
              lg:grid-cols-5
              xl:grid-cols-6
              gap-3
              lg:gap-4
              animate-fade-in
            "
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="transition-all duration-300 hover:-translate-y-1"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
