import {
  PackageIcon,
  MapPinIcon,
  PhoneCallIcon,
  InfoIcon,
  LogOutIcon,
  ShieldIcon,
  ChevronRightIcon,
  PencilIcon,
  XIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Loading from "../components/Loading";
import { useEffect, useState } from "react";
import api from "../config/api";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { user, loading, logout, updateUser } = useAuth();

  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        phone: user.phone,
      });
    }
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  const handleLogout = () => {
    logout();
  };

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user || saving) return;

    setSaving(true);

    try {
      const { data } = await api.put(`/profile/${user.id}`, {
        name: form.name,
        phone: form.phone,
      });

      updateUser({
        name: data.user.name,
        phone: data.user.phone,
      });

      toast.success("Profile updated");
      setEditMode(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    if (!user) return;

    setForm({
      name: user.name,
      phone: user.phone,
    });

    setEditMode(false);
  };

  return (
    <div className="min-h-screen bg-zinc-100">
      {/* Header */}
      <div
        className="relative pb-20 pt-10"
        style={{
          background:
            "linear-gradient(180deg, #3d6b4a 0%, #2d4a35 50%, #1b3022 100%)",
        }}
      >
        {/* Edit Button */}
        <button
          onClick={() => {
            if (editMode) {
              cancelEdit();
            } else {
              setEditMode(true);
            }
          }}
          className="absolute right-5 top-5 rounded-full bg-white p-2 text-[#1b3022] shadow-md transition hover:scale-105"
        >
          {editMode ? <XIcon size={18} /> : <PencilIcon size={18} />}
        </button>

        <div className="flex flex-col items-center px-4">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-3xl font-bold text-[#1b3022] shadow-lg">
            {user?.name.charAt(0).toUpperCase()}
          </div>

          <form
            onSubmit={handleProfileUpdate}
            className="mt-6 flex w-full max-w-sm flex-col items-center"
          >
            <div className="w-full text-center text-white">
              {/* Name */}
              {editMode ? (
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full rounded-md bg-white/10 px-3 py-2 text-center text-3xl font-bold tracking-tight text-white outline-none transition focus:bg-white/15"
                />
              ) : (
                <h2 className="text-4xl font-bold tracking-tight">
                  {user?.name}
                </h2>
              )}

              {/* Phone */}
              <div className="mt-2">
                {editMode ? (
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    placeholder="Not Added"
                    className="w-full rounded-md bg-white/10 px-3 py-2 text-center text-base text-white placeholder:text-white/50 outline-none transition focus:bg-white/15"
                  />
                ) : (
                  <p className="text-lg text-white/90">
                    {user?.phone || "Not Added"}
                  </p>
                )}
              </div>
              {/* Email */}
              <div className="mt-3">
                {editMode ? (
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full cursor-not-allowed rounded-md bg-white/10 px-3 py-2 text-center text-base text-white/80 outline-none"
                  />
                ) : (
                  <p className="text-lg text-white/90">{user?.email}</p>
                )}
              </div>
            </div>

            {editMode && (
              <button
                type="submit"
                disabled={saving}
                className="mt-6 w-full rounded-xl bg-white py-3 font-semibold text-[#1b3022] transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            )}
          </form>
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
