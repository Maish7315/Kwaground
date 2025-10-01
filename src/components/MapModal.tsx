import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Navigation, MapPin } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  from: string;
  to: string;
}

const MapModal = ({ isOpen, onClose, from, to }: MapModalProps) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  // Nairobi coordinates as default
  const nairobiCoords: [number, number] = [-1.2864, 36.8172];

  useEffect(() => {
    if (isOpen && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          // Fallback to Nairobi if geolocation fails
          setUserLocation(nairobiCoords);
        }
      );
    }
  }, [isOpen]);

  const openInGoogleMaps = () => {
    const origin = userLocation ? `${userLocation[0]},${userLocation[1]}` : "Nairobi";
    const destination = `${to}, Nairobi, Kenya`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=driving`;
    window.open(url, "_blank");
  };

  const openInWaze = () => {
    const destination = `${to}, Nairobi, Kenya`;
    const url = `https://waze.com/ul?q=${encodeURIComponent(destination)}`;
    window.open(url, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Route: {from} to {to}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full">
          <div className="flex gap-2 mb-4">
            <Button onClick={openInGoogleMaps} className="gap-2">
              <Navigation className="w-4 h-4" />
              Open in Google Maps
            </Button>
            <Button onClick={openInWaze} variant="outline" className="gap-2">
              <Navigation className="w-4 h-4" />
              Open in Waze
            </Button>
          </div>

          <div className="flex-1 rounded-lg overflow-hidden">
            <MapContainer
              center={userLocation || nairobiCoords}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {userLocation && (
                <Marker position={userLocation}>
                  <Popup>Your Location</Popup>
                </Marker>
              )}
              <Marker position={nairobiCoords}>
                <Popup>Destination: {to}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapModal;