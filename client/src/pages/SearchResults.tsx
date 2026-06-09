import { useEffect, useState } from "react";
import { dummyProducts } from "../assets/assets";
import type { Product } from "../types";
import { Link, useSearchParams } from "react-router-dom";
import { Home, Search } from "lucide-react";
import Loading from "../components/Loading";
import ProductCard from "../components/ProductCard";
import MobileSearch from "../components/MobileSearch";

const SearchResults = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  useEffect(() => {
    if (!query) return;

    setLoading(true);

    const filtered = dummyProducts.filter((p: Product) =>
      p.name.toLowerCase().includes(query.toLowerCase()),
    );

    setProducts(filtered);
    setLoading(false);
  }, [query]);

  return (
    <div className="min-h-screen bg-app-cream">
      <MobileSearch/>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center gap-2 text-sm text-app-text-light mb-6">
          <Link to="/" className="hover:text-app-green transition-colors">
            <Home className="size-4" />
          </Link>
          <span>/</span>
          <span className="text-app-green font-medium">Search Results</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-app-green mb-1">
            Results for "{query}"
          </h1>
          <p className="text-sm text-app-text-light">
            {loading ? "Searching..." : `${products.length} items found`}
          </p>
        </div>

        {loading ? (
          <Loading />
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Search className="size-16 text-app-border mx-auto mb-4" />

            <h2 className="text-xl font-semibold text-app-green mb-2">
              No results found
            </h2>

            <p className="text-sm text-app-text-light mb-6 max-w-md mx-auto">
              We couldn't find any "{query}".
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
                key={product._id}
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
