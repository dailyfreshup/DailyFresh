import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const MobileSearch = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-app-border md:hidden shadow-sm">
      <div className="py-3 px-4">
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />

            <input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="
                h-10 w-full
                rounded-md
                border border-zinc-200
                bg-zinc-50
                pl-10 pr-4
                text-sm
                text-zinc-700
                placeholder:text-zinc-400
                outline-none
                transition
                focus:border-green-700
                focus:bg-white
                focus:ring-2 focus:ring-green-100
              "
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default MobileSearch;
