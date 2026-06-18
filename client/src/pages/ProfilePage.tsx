import {
  PackageIcon,
  MapPinIcon,
  PhoneCallIcon,
  InfoIcon,
  LogOutIcon,
  ShieldIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Loading from "../components/Loading";

const ProfilePage = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  if (loading) {
    return <Loading />;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-zinc-100">
      {/* Header */}
      <div
        className="pb-20 pt-10"
        style={{
          background:
            "linear-gradient(180deg, #3d6b4a 0%, #2d4a35 50%, #1b3022 100%)",
        }}
      >
        <div className="flex flex-col items-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-3xl font-bold text-[#1b3022] shadow-lg">
            {user?.name.charAt(0).toUpperCase()}
          </div>

          <h1 className="mt-4 text-2xl font-bold text-white">{user?.name}</h1>

          <p className="mt-1 text-sm text-zinc-200">{user?.email}</p>

          <p className="text-sm text-zinc-300">{user?.phone}</p>
        </div>
      </div>

      {/* Content */}
      <div className="mt-10 px-4 pb-10">
        <div className="mx-auto max-w-2xl space-y-5">
          {/* Main Menu */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <Link
              to="/orders"
              className="flex items-center justify-between border-b border-zinc-100 p-4 transition hover:bg-zinc-50"
            >
              <div className="flex items-center gap-3">
                <PackageIcon size={20} className="text-[#1b3022]" />
                <div>
                  <p className="font-medium text-zinc-800">My Orders</p>
                  <p className="text-xs text-zinc-500">Track your purchases</p>
                </div>
              </div>

              <ChevronRightIcon size={18} />
            </Link>

            <Link
              to="/addresses"
              className="flex items-center justify-between border-b border-zinc-100 p-4 transition hover:bg-zinc-50"
            >
              <div className="flex items-center gap-3">
                <MapPinIcon size={20} className="text-[#1b3022]" />
                <div>
                  <p className="font-medium text-zinc-800">Saved Addresses</p>
                  <p className="text-xs text-zinc-500">
                    Manage delivery locations
                  </p>
                </div>
              </div>

              <ChevronRightIcon size={18} />
            </Link>

            <Link
              to="/contact"
              className="flex items-center justify-between border-b border-zinc-100 p-4 transition hover:bg-zinc-50"
            >
              <div className="flex items-center gap-3">
                <PhoneCallIcon size={20} className="text-[#1b3022]" />
                <div>
                  <p className="font-medium text-zinc-800">Contact Us</p>
                  <p className="text-xs text-zinc-500">Get support anytime</p>
                </div>
              </div>

              <ChevronRightIcon size={18} />
            </Link>

            <Link
              to="/about"
              className="flex items-center justify-between p-4 transition hover:bg-zinc-50"
            >
              <div className="flex items-center gap-3">
                <InfoIcon size={20} className="text-[#1b3022]" />
                <div>
                  <p className="font-medium text-zinc-800">About</p>
                  <p className="text-xs text-zinc-500">Know more about us</p>
                </div>
              </div>

              <ChevronRightIcon size={18} />
            </Link>
          </div>

          {/* Admin Panel */}
          {user?.isAdmin && (
            <div className="overflow-hidden rounded-2xl border border-green-200 bg-green-50 shadow-sm">
              <Link
                to="/admin"
                className="flex items-center justify-between p-4 transition hover:bg-green-100"
              >
                <div className="flex items-center gap-3">
                  <ShieldIcon size={22} className="text-[#1b3022]" />

                  <div>
                    <p className="font-semibold text-[#1b3022]">Admin Panel</p>

                    <p className="text-xs text-zinc-600">
                      Manage products & system
                    </p>
                  </div>
                </div>

                <ChevronRightIcon size={18} />
              </Link>
            </div>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1b3022] py-4 font-medium text-white shadow-sm transition hover:bg-[#2d4a35]"
          >
            <LogOutIcon size={18} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
