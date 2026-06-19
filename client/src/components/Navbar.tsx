import {
  ChevronDownIcon,
  InfoIcon,
  MenuIcon,
  PackageIcon,
  PhoneCallIcon,
  SearchIcon,
  ShoppingCartIcon,
  UserIcon,
  XIcon,
} from "lucide-react";

import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/authContext";

const Navbar = () => {
  const { user } = useAuth();

  const { cartCount, setIsCartOpen } = useCart();

  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close menu on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setUserMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    setUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      setUserMenuOpen(false); // close dropdown on scroll

      if (window.innerWidth >= 768) return;

      if (window.scrollY > lastScrollY && window.scrollY > 80) {
        setShowNavbar(false); // scrolling down
      } else {
        setShowNavbar(true); // scrolling up
      }

      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get("q") || "");
  }, [location.search]);

  return (
    <nav
      className={`sticky top-0 z-[1000] border-b border-app-border bg-white/90 backdrop-blur-md transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <div className="-ml-4 flex shrink-0 items-center sm:-ml-6 lg:-ml-8">
          <Link to="/">
            <img
              src={assets.logo_text}
              alt="Logo"
              className="w-40 object-contain"
            />
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-3 lg:gap-8">
          <div className="hidden items-center gap-6 text-sm font-medium text-zinc-600 md:flex">
            <Link to="/" className="transition-colors hover:text-green-950">
              Home
            </Link>

            <Link
              to="/products"
              className="transition-colors hover:text-green-950"
            >
              Products
            </Link>

            <Link
              to="/about"
              className="transition-colors hover:text-green-950"
            >
              About
            </Link>

            <Link
              to="/contact"
              className="transition-colors hover:text-green-950"
            >
              Contact
            </Link>
          </div>

          <form
            onSubmit={handleSearch}
            className="hidden flex-1 max-w-md sm:flex"
          >
            <div className="relative w-full">
              <SearchIcon className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />

              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-full rounded-full border border-zinc-200 bg-zinc-50 pl-11 pr-4 text-sm outline-none transition-all placeholder:text-zinc-400 focus:border-green-900 focus:bg-white focus:ring-4 focus:ring-green-100"
              />
            </div>
          </form>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex size-11 items-center justify-center rounded-2xl border border-zinc-200 bg-white transition-all hover:border-green-900 hover:bg-green-50"
            >
              <ShoppingCartIcon className="size-5 text-zinc-800" />

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex min-w-[18px] items-center justify-center rounded-full bg-green-600 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow">
                  {cartCount}
                </span>
              )}
            </button>

            <div className="relative" ref={menuRef}>
              {user ? (
                <button
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-2 py-1.5 transition-all hover:border-green-900 hover:bg-zinc-50"
                >
                  <div className="flex size-8 items-center justify-center rounded-full bg-green-950 text-sm font-semibold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>

                  <ChevronDownIcon
                    className={`size-4 text-zinc-500 transition-transform duration-200 ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="hidden items-center gap-2 rounded-full bg-green-950 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-green-900 md:flex"
                  >
                    <UserIcon size={16} />
                    Sign In
                  </Link>

                  <button
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    className="flex size-10 items-center justify-center rounded-xl border border-zinc-200 md:hidden"
                  >
                    {userMenuOpen ? (
                      <XIcon className="size-5" />
                    ) : (
                      <MenuIcon className="size-5" />
                    )}
                  </button>
                </div>
              )}

              {userMenuOpen && (
                <div className="absolute right-0 top-14 w-64 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] animate-in fade-in zoom-in-95 duration-200">
                  {user && (
                    <div className="border-b border-zinc-100 bg-zinc-50 px-4 py-4">
                      <p className="text-sm font-semibold text-zinc-900">
                        {user.name}
                      </p>

                      <p className="mt-0.5 text-xs text-zinc-500">
                        {user.email}
                      </p>
                    </div>
                  )}

                  <div className="py-2" onClick={() => setUserMenuOpen(false)}>
                    {!user && (
                      <Link to="/login" className="dropdown-link">
                        <UserIcon size={16} />
                        Sign In
                      </Link>
                    )}

                    {user && (
                      <Link to="/profile" className="dropdown-link">
                        <UserIcon size={16} />
                        My Profile
                      </Link>
                    )}

                    <div className="md:hidden">
                      <Link to="/products" className="dropdown-link">
                        <PackageIcon size={16} />
                        Products
                      </Link>

                      <Link to="/about" className="dropdown-link">
                        <InfoIcon size={16} />
                        About
                      </Link>

                      <Link to="/contact" className="dropdown-link">
                        <PhoneCallIcon size={16} />
                        Contact
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
