import { useEffect, useState } from "react";
import type { Address } from "../types";
import { MapPinIcon, PlusIcon } from "lucide-react";
import Loading from "../components/Loading";
import AddressCard from "../components/AddressCard";
import AddressForm from "../components/AddressForm";
import { useAuth } from "../context/authContext";
import api from "../config/api";
import toast from "react-hot-toast";

const Addresses = () => {
  const { updateUser } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    label: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    isDefault: false,
  });
  const resetForm = () => {
    setForm({
      label: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      isDefault: false,
    });
    setShowForm(false);
    setEditingId(null);
  };

  const getLocation = (retries = 3): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Cannot find location"));
        return;
      }
      const attempt = () => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error: any) => {
            if (retries > 0) {
              retries--;
              setTimeout(attempt, 1000);
            } else {
              reject(new Error(error.message || "Cannot find location"));
            }
          },
          {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 60000,
          },
        );
      };
      attempt();
    });
  };
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      const coords = await getLocation();
      const payload = { ...form, ...coords };
      if (editingId) {
        const { data } = await api.put(`/addresses/${editingId}`, payload);
        setAddresses(data.addresses);
        updateUser({ addresses: data.addresses });
        toast.success("Address updated");
      } else {
        const { data } = await api.post(`/addresses`, payload);
        setAddresses(data.addresses);
        updateUser({ addresses: data.addresses });
        toast.success("Address added");
      }
      resetForm();
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Failed");
    }
  };
  const onEditHandler = (add: Address) => {
    setForm({
      label: add.label,
      address: add.address,
      city: add.city,
      state: add.state,
      zip: add.zip,
      isDefault: add.isDefault,
    });
    setEditingId(add.id);
    setShowForm(true);
  };
  useEffect(() => {
    api
      .get("/addresses")
      .then(({ data }) => {
        setAddresses(data.addresses);
      })
      .catch((error: any) => {
        toast.error(error.response?.data?.message || error?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return (
    <div className="min-h-screen bg-app-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <div className="bg-white rounded-3xl border border-app-border p-6 mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-app-green">
                Saved Addresses
              </h1>
              <p className="text-sm text-app-text-light mt-1">
                Manage all your delivery locations in one place.
              </p>
            </div>

            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="
              flex items-center justify-center gap-2
              px-5 py-3
              bg-app-green
              text-white
              rounded-2xl
              font-medium
              hover:bg-app-green-light
              transition-all
            "
            >
              <PlusIcon className="size-4" />
              Add Address
            </button>
          </div>
        </div>

        {showForm && (
          <AddressForm
            resetForm={resetForm}
            handleSubmit={handleSubmit}
            form={form}
            setForm={setForm}
            editingId={editingId}
          />
        )}

        {loading ? (
          <Loading />
        ) : addresses.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-app-border">
            <div className="size-20 mx-auto rounded-full bg-app-green/10 flex items-center justify-center">
              <MapPinIcon className="size-10 text-app-green" />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-app-green">
              No addresses saved
            </h2>

            <p className="text-app-text-light mt-2">
              Add your first delivery location.
            </p>

            <button
              onClick={() => setShowForm(true)}
              className="mt-6 px-5 py-3 bg-app-green text-white rounded-2xl"
            >
              Add Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {addresses.map((addr) => (
              <AddressCard
                key={addr.id}
                addr={addr}
                onEditHandler={onEditHandler}
                setAddresses={setAddresses}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Addresses;
