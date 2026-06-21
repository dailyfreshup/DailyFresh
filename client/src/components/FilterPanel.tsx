  type FilterPanelProps = {
    categories: any[];
    category: string;
    updateFilter: (key: string, value: string) => void;
    clearFilters: () => void;
    hasFilters: boolean;
    onClose?: () => void;
  };

  const FilterPanel = ({
    categories,
    category,
    updateFilter,
    clearFilters,
    hasFilters,
    onClose,
  }: FilterPanelProps) => {
    const categoriesWithAll = [{ slug: "", name: "All Products" }, ...categories];

    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-app-green">Filters</h2>

          {hasFilters && (
            <button
              onClick={() => {
                clearFilters();
                onClose?.();
              }}
              className="text-sm text-app-error hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        <div className="space-y-2">
          {categoriesWithAll.map((cat: any) => (
            <button
              key={cat.slug}
              onClick={() => {
                updateFilter("category", cat.slug);
                onClose?.();
              }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                category === cat.slug
                  ? "bg-app-green text-white"
                  : "bg-app-cream text-app-text-light hover:bg-green-50"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    );
  };

  export default FilterPanel;
