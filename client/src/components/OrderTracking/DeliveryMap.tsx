import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { MapPinIcon } from "lucide-react";
import { iconsForLeafpad } from "../../assets/assets";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Props = {
  lat?: number;
  lng?: number;
};

export default function LiveMap({ lat, lng }: Props) {
  const destinationIcon = new L.Icon({
    iconUrl: iconsForLeafpad.destination,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  if (!lat || !lng) {
    return (
      <div className="h-[280px] bg-app-green/5 flex items-center justify-center rounded-2xl border border-app-border">
        <div className="text-center">
          <MapPinIcon className="size-8 text-app-green/40 mx-auto mb-2" />
          <p className="text-sm text-app-green/50 font-medium">
            Delivery location not available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden border border-app-border"
      style={{ height: 280 }}
    >
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={[lat, lng]} icon={destinationIcon}>
          <Popup>Delivery Address</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
