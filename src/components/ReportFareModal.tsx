import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navigation, AlertTriangle, MapPin } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Mock county council office locations (coordinates for major Kenyan cities)
const countyOffices = [
  { name: "Nairobi County Council", lat: -1.2864, lng: 36.8172, county: "Nairobi" },
  { name: "Mombasa County Council", lat: -4.0435, lng: 39.6682, county: "Mombasa" },
  { name: "Kisumu County Council", lat: -0.0917, lng: 34.7679, county: "Kisumu" },
  { name: "Nakuru County Council", lat: -0.3031, lng: 36.0800, county: "Nakuru" },
  { name: "Eldoret County Council", lat: 0.5143, lng: 35.2698, county: "Uasin Gishu" },
  { name: "Thika County Council", lat: -1.0388, lng: 37.0834, county: "Kiambu" },
  { name: "Kakamega County Council", lat: 0.2827, lng: 34.7519, county: "Kakamega" },
  { name: "Meru County Council", lat: 0.0476, lng: 37.6459, county: "Meru" },
];

interface ReportFareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReportFareModal = ({ isOpen, onClose }: ReportFareModalProps) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [nearestOffice, setNearestOffice] = useState<typeof countyOffices[0] | null>(null);
  const [loading, setLoading] = useState(true);

  // Nairobi coordinates as default
  const nairobiCoords: [number, number] = [-1.2864, 36.8172];

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userCoords: [number, number] = [position.coords.latitude, position.coords.longitude];
            setUserLocation(userCoords);
            findNearestOffice(userCoords);
          },
          () => {
            // Fallback to Nairobi if geolocation fails
            setUserLocation(nairobiCoords);
            findNearestOffice(nairobiCoords);
          }
        );
      } else {
        setUserLocation(nairobiCoords);
        findNearestOffice(nairobiCoords);
      }
    }
  }, [isOpen]);

  const findNearestOffice = (userCoords: [number, number]) => {
    let nearest = null;
    let minDistance = Infinity;

    countyOffices.forEach(office => {
      const distance = calculateDistance(userCoords[0], userCoords[1], office.lat, office.lng);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = office;
      }
    });

    // If nearest office is more than 50km away, consider it not available
    if (minDistance > 50) {
      setNearestOffice(null);
    } else {
      setNearestOffice(nearest);
    }
    setLoading(false);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180);
  };

  const openInGoogleMaps = () => {
    if (!nearestOffice || !userLocation) return;

    const origin = `${userLocation[0]},${userLocation[1]}`;
    const destination = `${nearestOffice.lat},${nearestOffice.lng}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=driving`;
    window.open(url, "_blank");
  };

  const openInWaze = () => {
    if (!nearestOffice) return;

    const destination = `${nearestOffice.name}, ${nearestOffice.county}, Kenya`;
    const url = `https://waze.com/ul?q=${encodeURIComponent(destination)}`;
    window.open(url, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Report Fare Issue
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full">
          <div className="mb-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Kindly visit the nearest county council office and report the fare issue.
                {nearestOffice && ` The nearest office is ${nearestOffice.name}.`}
              </AlertDescription>
            </Alert>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <p>Loading your location...</p>
            </div>
          ) : nearestOffice ? (
            <>
              <div className="flex gap-2 mb-4">
                <Button onClick={openInGoogleMaps} className="gap-2">
                  <Navigation className="w-4 h-4" />
                  Directions to {nearestOffice.name}
                </Button>
                <Button onClick={openInWaze} variant="outline" className="gap-2">
                  <Navigation className="w-4 h-4" />
                  Open in Waze
                </Button>
              </div>

              <div className="flex-1 rounded-lg overflow-hidden">
                <MapContainer
                  center={userLocation || nairobiCoords}
                  zoom={12}
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
                  <Marker position={[nearestOffice.lat, nearestOffice.lng]}>
                    <Popup>
                      <div>
                        <strong>{nearestOffice.name}</strong><br />
                        {nearestOffice.county} County Council
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <Alert className="max-w-md">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  There is no county council office near you. Please contact your local authorities through other means.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportFareModal;