import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { categoriesData } from "../assets/assets";
import type { Product } from "../types";

import { SlidersHorizontal, XIcon } from "lucide-react";

import ProductCard from "../components/ProductCard";
import Loading from "../components/Loading";
import FilterPanel from "../components/FilterPanel";
import MobileSearch from "../components/MobileSearch";
import api from "../config/api";
import toast from "react-hot-toast";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  // const location = useLocation();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = searchParams.get("category") || "";

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category && category !== "all") {
        params.set("category", category);
      }
      const { data } = await api.get(`/products?${params.toString()}`);
      setProducts(data.products);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);

    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }

    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const activeCategory = categoriesData.find((c) => c.slug === category);

  const hasFilters = !!category;

  useEffect(() => {
    fetchProducts();
  }, [category]);
  // useEffect(() => {
  //   window.scrollTo({
  //     top: 0,
  //     behavior: "smooth",
  //   });
  // }, [location.search]);

  useEffect(() => {
    if (filtersOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [filtersOpen]);

  return (
    <div
      className={`min-h-screen bg-app-cream ${
        filtersOpen ? "h-screen overflow-hidden" : ""
      }`}
    >
      <MobileSearch />
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-app-green">
              {activeCategory ? activeCategory.name : "All Products"}
            </h1>

            <p className="text-sm text-app-text-light mt-1">
              {products.length} products
            </p>
          </div>

          <div className="flex items-center gap-3">
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="rounded-lg border border-app-border bg-white px-4 py-2 text-sm font-medium text-app-green transition hover:bg-app-green hover:text-white"
              >
                Clear
              </button>
            )}

            <button
              onClick={() => setFiltersOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-app-border rounded-xl shadow-sm hover:shadow transition-all duration-200 active:scale-95"
            >
              <SlidersHorizontal className="size-4" />
              Filters
            </button>
          </div>
        </div>

        <div className="transition-all duration-300 ease-in-out">
          {loading ? (
            <Loading />
          ) : products.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              <p className="text-lg font-semibold text-app-green mb-2">
                No products found
              </p>

              <button
                onClick={clearFilters}
                className="mt-4 px-5 py-2 bg-app-green text-white rounded-xl hover:bg-app-green-light transition-all duration-200 hover:scale-[1.02] active:scale-95"
              >
                Clear Filters
              </button>
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
              {products.map(
                (product) =>
                  product.stock > 0 && (
                    <div
                      key={product.id}
                      className="transition-all duration-300 hover:-translate-y-1"
                    >
                      <ProductCard product={product} />
                    </div>
                  ),
              )}
            </div>
          )}
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[1100] transition-all duration-300 ${
          filtersOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          onClick={() => setFiltersOpen(false)}
          className={`absolute inset-0 bg-black/30 backdrop-blur-[1px]
          transition-opacity duration-300 ${
            filtersOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          className={`absolute top-0 left-0 h-full w-[300px] bg-white shadow-2xl
          transition-transform duration-300 ease-out
          ${filtersOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between p-4 border-b border-app-border">
            <h3 className="text-lg font-semibold text-app-green">Categories</h3>

            <button
              onClick={() => setFiltersOpen(false)}
              className="p-2 rounded-lg hover:bg-app-cream transition-colors duration-200"
            >
              <XIcon className="size-5" />
            </button>
          </div>

          <div className="p-4 overflow-y-auto h-[calc(100%-72px)]">
            <FilterPanel
              categories={categoriesData}
              category={category}
              updateFilter={updateFilter}
              clearFilters={clearFilters}
              hasFilters={hasFilters}
              onClose={() => setFiltersOpen(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
