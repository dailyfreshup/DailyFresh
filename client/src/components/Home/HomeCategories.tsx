import { Link } from "react-router-dom";
import { categoriesData } from "../../assets/assets";

const HomeCategories = () => {
  return (
    <section className="py-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold">Categories</h2>
      </div>

      <div className="flex items-center mt-4 overflow-x-scroll no-scrollbar">
        {categoriesData.map((cat) => (
          <Link
            key={cat.slug}
            to={`/products?category=${cat.slug}`}
            onClick={() => window.scrollTo(0, 0)}
            className="group flex flex-col items-center gap-3 p-4 shrink-0"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-18 h-18 sm:w-26 sm:h-26 object-cover rounded-2xl"
            />

            <span className="text-xs font-medium text-zinc-600 text-center leading-tight">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default HomeCategories;
