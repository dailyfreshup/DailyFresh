import { useEffect, useState } from "react";
import type { Address } from "../types";
import { dummyAddressData } from "../assets/assets";
import { MapPinIcon, PlusIcon } from "lucide-react";
import Loading from "../components/Loading";
import AddressCard from "../components/AddressCard";
import AddressForm from "../components/AddressForm";

const Addresses = () => {
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
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
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
    setEditingId(add._id);
    setShowForm(true);
  };
  useEffect(() => {
    setAddresses(dummyAddressData);
    setTimeout(() => setLoading(false), 1000);
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
                key={addr._id}
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
