import { ArrowRightIcon, LeafIcon } from "lucide-react";
import { heroSectionData } from "../../assets/assets";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative overflow-hidden rounded-3xl min-h-[500px] flex items-center mb-10">
      <img
        src={heroSectionData.hero_image}
        alt="Hero"
        className="absolute inset-0 w-full h-full object-cover object-[60%_center] sm:object-center"
      />

      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16 py-16">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-400/15 border border-orange-300/20 text-orange-100 text-sm mb-6 backdrop-blur-sm">
            <LeafIcon className="w-4 h-4 text-orange-300" />
            Trusted by Restaurants & Retailers
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white mb-5">
            Fresh Supplies for{" "}
            <span className="text-orange-300">Hotels, Shops & Restaurants</span>
          </h1>

          <p className="text-white/90 text-base sm:text-lg leading-relaxed max-w-xl mb-8">
            {heroSectionData.description}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/products"
              className="px-6 py-3 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white font-medium backdrop-blur-sm transition-all duration-200 flex items-center gap-2"
            >
              Search Products
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
