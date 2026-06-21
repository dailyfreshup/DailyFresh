import { useState } from "react";
import { Navigate, NavLink, Outlet } from "react-router-dom";
import {
  PlusIcon,
  PackageSearchIcon,
  ShoppingBagIcon,
  LogOutIcon,
  BarChart3Icon,
  ShieldIcon,
  Megaphone,
  ChevronDown,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/authContext";
import Loading from "../../components/Loading";

export default function AdminLayout() {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const AdminLinkData = [
    { to: "/admin", label: "Dashboard", icon: BarChart3Icon },
    { to: "/admin/products/new", label: "Add Product", icon: PlusIcon },
    { to: "/admin/products", label: "Products", icon: PackageSearchIcon },
    { to: "/admin/orders", label: "Orders", icon: ShoppingBagIcon },
    { to: "/admin/announcement", label: "Announcement", icon: Megaphone },
    { to: "/", label: "Exit", icon: LogOutIcon },
  ];

  if (loading) {
    return <Loading />;
  }

  if (!user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="h-screen overflow-hidden">
      {/* Desktop Navbar */}
      <div className="max-lg:hidden">
        <Navbar />
      </div>

      <div className="flex flex-col h-full lg:flex-row gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 bg-white rounded-2xl border border-app-border h-fit">
          {/* Header */}
          <div
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="flex items-center justify-between p-4 border-b border-app-border lg:cursor-default cursor-pointer select-none"
          >
            <h2 className="text-lg font-semibold text-app-green flex items-center gap-2">
              <ShieldIcon className="size-5 text-green-900" />
              Admin Panel
            </h2>

            {/* Mobile Arrow */}
            <ChevronDown
              className={`size-5 text-zinc-700 transition-transform duration-300 lg:hidden ${
                sidebarOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* Navigation */}
          <nav
            className={`
              flex-col gap-1.5 p-4
              ${sidebarOpen ? "flex" : "hidden"}
              lg:flex
            `}
          >
            {AdminLinkData.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2.5 rounded-md text-sm transition-colors ${
                    isActive
                      ? "bg-app-green text-white"
                      : "text-app-text-light hover:bg-orange-50 hover:text-zinc-900"
                  }`
                }
              >
                <link.icon className="size-4" />
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto no-scrollbar pb-20">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
