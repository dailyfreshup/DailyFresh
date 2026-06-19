import { CheckIcon, MapPinIcon, PencilIcon, Trash2Icon } from "lucide-react";
import type { Address } from "../types";

interface AddressCardProps {
  addr: Address;
  onEditHandler: (addr: Address) => void;
  setAddresses: (addresses: Address[]) => void;
}

const AddressCard = ({
  addr,
  onEditHandler,
  // Look into it later...
  // setAddresses,
}: AddressCardProps) => {
  const handleDelete = async (id: string) => {
    console.log(id);
  };

  return (
    <div
      className="
        bg-white
        rounded-3xl
        border border-app-border
        p-5
        shadow-sm
        hover:shadow-lg
        transition-all duration-300
      "
    >
      <div className="flex items-start gap-4">
        <div className="size-12 rounded-2xl bg-app-green/10 flex items-center justify-center shrink-0">
          <MapPinIcon className="size-6 text-app-green" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-app-green text-base">
              {addr.label}
            </h3>

            {addr.isDefault && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-green-100 text-green-700">
                <CheckIcon className="size-3" />
                Default
              </span>
            )}
          </div>

          <p className="mt-3 text-sm text-app-text-light leading-relaxed">
            {addr.address}
          </p>

          <p className="text-sm text-app-text-light">
            {addr.city}, {addr.state}
          </p>

          <p className="text-sm text-app-text-light">{addr.zip}</p>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-app-border flex justify-end gap-2">
        <button
          onClick={() => onEditHandler(addr)}
          className="
            flex items-center gap-2
            px-3 py-2
            rounded-xl
            bg-app-cream
            text-app-green
            hover:bg-app-green/10
            transition-all
          "
        >
          <PencilIcon className="size-4" />
          <span className="text-sm font-medium">Edit</span>
        </button>

        <button
          onClick={() => handleDelete(addr.id)}
          className="
            flex items-center gap-2
            px-3 py-2
            rounded-xl
            bg-red-50
            text-red-600
            hover:bg-red-100
            transition-all
          "
        >
          <Trash2Icon className="size-4" />
          <span className="text-sm font-medium">Delete</span>
        </button>
      </div>
    </div>
  );
};

export default AddressCard;
