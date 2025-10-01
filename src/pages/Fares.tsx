import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MapModal from "@/components/MapModal";
import ReportFareModal from "@/components/ReportFareModal";
import SearchBar from "@/components/SearchBar";
import FareCard from "@/components/FareCard";
import { Button } from "@/components/ui/button";
import { Plus, MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Comprehensive fare database for all counties
const countyFares: Record<string, Array<{
  from: string;
  to: string;
  matatu: number;
  boda: number;
  duration: string;
  trending: boolean;
  lastUpdated: string;
}>> = {
  "Nairobi": [
    { from: "CBD", to: "Westlands", matatu: 80, boda: 120, duration: "25 min", trending: true, lastUpdated: "5 mins ago" },
    { from: "CBD", to: "Karen", matatu: 100, boda: 150, duration: "35 min", trending: true, lastUpdated: "8 mins ago" },
    { from: "CBD", to: "Kileleshwa", matatu: 70, boda: 110, duration: "20 min", trending: false, lastUpdated: "12 mins ago" },
    { from: "Westlands", to: "Karen", matatu: 60, boda: 90, duration: "15 min", trending: true, lastUpdated: "15 mins ago" },
    { from: "CBD", to: "Rongai", matatu: 120, boda: 180, duration: "45 min", trending: false, lastUpdated: "18 mins ago" },
    { from: "CBD", to: "Kasarani", matatu: 90, boda: 130, duration: "30 min", trending: false, lastUpdated: "22 mins ago" },
    { from: "CBD", to: "Eastleigh", matatu: 50, boda: 80, duration: "15 min", trending: true, lastUpdated: "25 mins ago" },
    { from: "CBD", to: "South B", matatu: 70, boda: 100, duration: "25 min", trending: false, lastUpdated: "28 mins ago" },
    { from: "CBD", to: "Ngong", matatu: 150, boda: 220, duration: "55 min", trending: false, lastUpdated: "30 mins ago" },
    { from: "CBD", to: "Thika Road", matatu: 60, boda: 90, duration: "20 min", trending: true, lastUpdated: "35 mins ago" },
    { from: "Juja", to: "CBD", matatu: 100, boda: 150, duration: "40 min", trending: true, lastUpdated: "40 mins ago" },
    { from: "Thika", to: "CBD", matatu: 120, boda: 180, duration: "50 min", trending: true, lastUpdated: "45 mins ago" },
    { from: "Limuru", to: "CBD", matatu: 80, boda: 120, duration: "35 min", trending: false, lastUpdated: "50 mins ago" },
    { from: "Kiambu", to: "CBD", matatu: 70, boda: 100, duration: "30 min", trending: false, lastUpdated: "55 mins ago" },
    { from: "Ruiru", to: "CBD", matatu: 90, boda: 130, duration: "35 min", trending: false, lastUpdated: "1 hour ago" },
  ],
  "Mombasa": [
    { from: "CBD", to: "Nyali", matatu: 50, boda: 80, duration: "20 min", trending: true, lastUpdated: "5 mins ago" },
    { from: "CBD", to: "South Coast", matatu: 70, boda: 110, duration: "30 min", trending: true, lastUpdated: "10 mins ago" },
    { from: "CBD", to: "Kilifi", matatu: 200, boda: 300, duration: "1.5 hr", trending: false, lastUpdated: "15 mins ago" },
    { from: "CBD", to: "Malindi", matatu: 400, boda: 600, duration: "3 hr", trending: false, lastUpdated: "20 mins ago" },
    { from: "CBD", to: "Lamu", matatu: 800, boda: 1200, duration: "6 hr", trending: false, lastUpdated: "25 mins ago" },
    { from: "CBD", to: "Voi", matatu: 300, boda: 450, duration: "2.5 hr", trending: false, lastUpdated: "30 mins ago" },
    { from: "CBD", to: "Taveta", matatu: 350, boda: 520, duration: "3 hr", trending: false, lastUpdated: "35 mins ago" },
    { from: "Nyali", to: "South Coast", matatu: 60, boda: 90, duration: "25 min", trending: true, lastUpdated: "40 mins ago" },
    { from: "CBD", to: "Bamburi", matatu: 40, boda: 60, duration: "15 min", trending: false, lastUpdated: "45 mins ago" },
    { from: "CBD", to: "Mombasa Road", matatu: 30, boda: 50, duration: "10 min", trending: true, lastUpdated: "50 mins ago" },
  ],
  "Kisumu": [
    { from: "Town", to: "Mega City", matatu: 40, boda: 60, duration: "15 min", trending: true, lastUpdated: "5 mins ago" },
    { from: "Town", to: "Industrial Area", matatu: 50, boda: 70, duration: "20 min", trending: false, lastUpdated: "10 mins ago" },
    { from: "Town", to: "Kisumu Airport", matatu: 80, boda: 120, duration: "35 min", trending: true, lastUpdated: "15 mins ago" },
    { from: "Town", to: "Ahero", matatu: 60, boda: 90, duration: "25 min", trending: false, lastUpdated: "20 mins ago" },
    { from: "Town", to: "Muhoroni", matatu: 100, boda: 150, duration: "45 min", trending: false, lastUpdated: "25 mins ago" },
    { from: "Town", to: "Nyakach", matatu: 120, boda: 180, duration: "50 min", trending: false, lastUpdated: "30 mins ago" },
    { from: "Mega City", to: "Industrial Area", matatu: 30, boda: 45, duration: "10 min", trending: true, lastUpdated: "35 mins ago" },
    { from: "Town", to: "Kondele", matatu: 35, boda: 50, duration: "12 min", trending: false, lastUpdated: "40 mins ago" },
  ],
  "Nakuru": [
    { from: "Town", to: "Naivasha", matatu: 150, boda: 220, duration: "1 hr", trending: true, lastUpdated: "5 mins ago" },
    { from: "Town", to: "Industrial Area", matatu: 40, boda: 60, duration: "15 min", trending: false, lastUpdated: "10 mins ago" },
    { from: "Town", to: "Gilgil", matatu: 100, boda: 150, duration: "45 min", trending: false, lastUpdated: "15 mins ago" },
    { from: "Town", to: "Elementaita", matatu: 80, boda: 120, duration: "35 min", trending: false, lastUpdated: "20 mins ago" },
    { from: "Town", to: "Molo", matatu: 120, boda: 180, duration: "50 min", trending: false, lastUpdated: "25 mins ago" },
    { from: "Naivasha", to: "Gilgil", matatu: 60, boda: 90, duration: "25 min", trending: true, lastUpdated: "30 mins ago" },
  ],
  "Eldoret": [
    { from: "Town", to: "Moi University", matatu: 50, boda: 70, duration: "20 min", trending: true, lastUpdated: "5 mins ago" },
    { from: "Town", to: "Industrial Area", matatu: 40, boda: 60, duration: "15 min", trending: false, lastUpdated: "10 mins ago" },
    { from: "Town", to: "Turbo", matatu: 80, boda: 120, duration: "35 min", trending: false, lastUpdated: "15 mins ago" },
    { from: "Town", to: "Kapsabet", matatu: 100, boda: 150, duration: "45 min", trending: false, lastUpdated: "20 mins ago" },
    { from: "Town", to: "Kitale", matatu: 150, boda: 220, duration: "1 hr", trending: false, lastUpdated: "25 mins ago" },
  ],
  "Kakamega": [
    { from: "Town", to: "Mumias", matatu: 120, boda: 180, duration: "50 min", trending: true, lastUpdated: "5 mins ago" },
    { from: "Town", to: "Butere", matatu: 100, boda: 150, duration: "45 min", trending: false, lastUpdated: "10 mins ago" },
    { from: "Town", to: "Webuye", matatu: 80, boda: 120, duration: "35 min", trending: false, lastUpdated: "15 mins ago" },
    { from: "Town", to: "Malava", matatu: 60, boda: 90, duration: "25 min", trending: false, lastUpdated: "20 mins ago" },
  ],
  "Meru": [
    { from: "Town", to: "Maua", matatu: 150, boda: 220, duration: "1 hr", trending: true, lastUpdated: "5 mins ago" },
    { from: "Town", to: "Chuka", matatu: 120, boda: 180, duration: "50 min", trending: false, lastUpdated: "10 mins ago" },
    { from: "Town", to: "Nkubu", matatu: 80, boda: 120, duration: "35 min", trending: false, lastUpdated: "15 mins ago" },
  ],
  "Thika": [
    { from: "Town", to: "CBD", matatu: 120, boda: 180, duration: "50 min", trending: true, lastUpdated: "5 mins ago" },
    { from: "Town", to: "Juja", matatu: 60, boda: 90, duration: "25 min", trending: false, lastUpdated: "10 mins ago" },
    { from: "Town", to: "Ruiru", matatu: 80, boda: 120, duration: "35 min", trending: false, lastUpdated: "15 mins ago" },
  ],
  "Machakos": [
    { from: "Town", to: "CBD", matatu: 100, boda: 150, duration: "45 min", trending: true, lastUpdated: "5 mins ago" },
    { from: "Town", to: "Athi River", matatu: 80, boda: 120, duration: "35 min", trending: false, lastUpdated: "10 mins ago" },
    { from: "Town", to: "Kangundo", matatu: 60, boda: 90, duration: "25 min", trending: false, lastUpdated: "15 mins ago" },
  ],
  "Kiambu": [
    { from: "Town", to: "CBD", matatu: 70, boda: 100, duration: "30 min", trending: true, lastUpdated: "5 mins ago" },
    { from: "Town", to: "Limuru", matatu: 50, boda: 70, duration: "20 min", trending: false, lastUpdated: "10 mins ago" },
    { from: "Town", to: "Ruiru", matatu: 60, boda: 90, duration: "25 min", trending: false, lastUpdated: "15 mins ago" },
  ],
  "Murang'a": [
    { from: "Town", to: "CBD", matatu: 120, boda: 180, duration: "50 min", trending: true, lastUpdated: "5 mins ago" },
    { from: "Town", to: "Thika", matatu: 80, boda: 120, duration: "35 min", trending: false, lastUpdated: "10 mins ago" },
    { from: "Town", to: "Kandara", matatu: 60, boda: 90, duration: "25 min", trending: false, lastUpdated: "15 mins ago" },
  ],
  "Nyeri": [
    { from: "Town", to: "CBD", matatu: 150, boda: 220, duration: "1 hr", trending: true, lastUpdated: "5 mins ago" },
    { from: "Town", to: "Nanyuki", matatu: 100, boda: 150, duration: "45 min", trending: false, lastUpdated: "10 mins ago" },
    { from: "Town", to: "Karatina", matatu: 80, boda: 120, duration: "35 min", trending: false, lastUpdated: "15 mins ago" },
  ],
  "Kirinyaga": [
    { from: "Town", to: "CBD", matatu: 130, boda: 190, duration: "55 min", trending: true, lastUpdated: "5 mins ago" },
    { from: "Town", to: "Kerugoya", matatu: 60, boda: 90, duration: "25 min", trending: false, lastUpdated: "10 mins ago" },
    { from: "Town", to: "Sagana", matatu: 80, boda: 120, duration: "35 min", trending: false, lastUpdated: "15 mins ago" },
  ],
  "Embu": [
    { from: "Town", to: "CBD", matatu: 140, boda: 210, duration: "1 hr", trending: true, lastUpdated: "5 mins ago" },
    { from: "Town", to: "Runyenjes", matatu: 100, boda: 150, duration: "45 min", trending: false, lastUpdated: "10 mins ago" },
    { from: "Town", to: "Siakago", matatu: 80, boda: 120, duration: "35 min", trending: false, lastUpdated: "15 mins ago" },
  ],
  "Kitui": [
    { from: "Town", to: "CBD", matatu: 160, boda: 240, duration: "1.5 hr", trending: true, lastUpdated: "5 mins ago" },
    { from: "Town", to: "Mwingi", matatu: 120, boda: 180, duration: "50 min", trending: false, lastUpdated: "10 mins ago" },
    { from: "Town", to: "Mutomo", matatu: 100, boda: 150, duration: "45 min", trending: false, lastUpdated: "15 mins ago" },
  ],
  "Narok": [
    { from: "Town", to: "CBD", matatu: 180, boda: 270, duration: "2 hr", trending: true, lastUpdated: "5 mins ago" },
    { from: "Town", to: "Kilgoris", matatu: 120, boda: 180, duration: "50 min", trending: false, lastUpdated: "10 mins ago" },
    { from: "Town", to: "Ololulung'a", matatu: 100, boda: 150, duration: "45 min", trending: false, lastUpdated: "15 mins ago" },
  ],
  "Kajiado": [
    { from: "Town", to: "CBD", matatu: 170, boda: 250, duration: "1.5 hr", trending: true, lastUpdated: "5 mins ago" },
    { from: "Town", to: "Ngong", matatu: 80, boda: 120, duration: "35 min", trending: false, lastUpdated: "10 mins ago" },
    { from: "Town", to: "Kitengela", matatu: 100, boda: 150, duration: "45 min", trending: false, lastUpdated: "15 mins ago" },
  ],
  "Kericho": [
    { from: "Town", to: "CBD", matatu: 200, boda: 300, duration: "2.5 hr", trending: true, lastUpdated: "5 mins ago" },
    { from: "Town", to: "Kipkelion", matatu: 80, boda: 120, duration: "35 min", trending: false, lastUpdated: "10 mins ago" },
    { from: "Town", to: "Londiani", matatu: 100, boda: 150, duration: "45 min", trending: false, lastUpdated: "15 mins ago" },
  ],
  "Bomet": [
    { from: "Town", to: "CBD", matatu: 190, boda: 280, duration: "2 hr", trending: true, lastUpdated: "5 mins ago" },
    { from: "Town", to: "Sotik", matatu: 80, boda: 120, duration: "35 min", trending: false, lastUpdated: "10 mins ago" },
    { from: "Town", to: "Chepalungu", matatu: 100, boda: 150, duration: "45 min", trending: false, lastUpdated: "15 mins ago" },
  ],
  "Homa Bay": [
    { from: "Town", to: "CBD", matatu: 220, boda: 330, duration: "3 hr", trending: true, lastUpdated: "5 mins ago" },
    { from: "Town", to: "Mbita", matatu: 80, boda: 120, duration: "35 min", trending: false, lastUpdated: "10 mins ago" },
    { from: "Town", to: "Ndhiwa", matatu: 100, boda: 150, duration: "45 min", trending: false, lastUpdated: "15 mins ago" },
  ],
  "Migori": [
    { from: "Town", to: "CBD", matatu: 210, boda: 310, duration: "2.5 hr", trending: true, lastUpdated: "5 mins ago" },
    { from: "Town", to: "Isebania", matatu: 120, boda: 180, duration: "50 min", trending: false, lastUpdated: "10 mins ago" },
    { from: "Town", to: "Kehancha", matatu: 100, boda: 150, duration: "45 min", trending: false, lastUpdated: "15 mins ago" },
  ],
  "Kisii": [
    { from: "Town", to: "CBD", matatu: 230, boda: 340, duration: "3 hr", trending: true, lastUpdated: "5 mins ago" },
    { from: "Town", to: "Keroka", matatu: 80, boda: 120, duration: "35 min", trending: false, lastUpdated: "10 mins ago" },
    { from: "Town", to: "Nyamache", matatu: 100, boda: 150, duration: "45 min", trending: false, lastUpdated: "15 mins ago" },
  ],
  "Nyamira": [
    { from: "Town", to: "CBD", matatu: 240, boda: 360, duration: "3.5 hr", trending: true, lastUpdated: "5 mins ago" },
    { from: "Town", to: "Manga", matatu: 80, boda: 120, duration: "35 min", trending: false, lastUpdated: "10 mins ago" },
    { from: "Town", to: "Nyansiongo", matatu: 100, boda: 150, duration: "45 min", trending: false, lastUpdated: "15 mins ago" },
  ],
  "Taita Taveta": [
    { from: "Voi", to: "CBD", matatu: 300, boda: 450, duration: "4 hr", trending: true, lastUpdated: "5 mins ago" },
    { from: "Voi", to: "Taveta", matatu: 80, boda: 120, duration: "35 min", trending: false, lastUpdated: "10 mins ago" },
    { from: "Voi", to: "Mwatate", matatu: 100, boda: 150, duration: "45 min", trending: false, lastUpdated: "15 mins ago" },
  ],
  "Kwale": [
    { from: "Ukunda", to: "CBD", matatu: 80, boda: 120, duration: "35 min", trending: true, lastUpdated: "5 mins ago" },
    { from: "Ukunda", to: "Diani", matatu: 60, boda: 90, duration: "25 min", trending: false, lastUpdated: "10 mins ago" },
    { from: "Ukunda", to: "Lunga Lunga", matatu: 100, boda: 150, duration: "45 min", trending: false, lastUpdated: "15 mins ago" },
  ],
  "Kilifi": [
    { from: "Town", to: "CBD", matatu: 250, boda: 370, duration: "3.5 hr", trending: true, lastUpdated: "5 mins ago" },
    { from: "Town", to: "Malindi", matatu: 120, boda: 180, duration: "50 min", trending: false, lastUpdated: "10 mins ago" },
    { from: "Town", to: "Watamu", matatu: 100, boda: 150, duration: "45 min", trending: false, lastUpdated: "15 mins ago" },
  ],
  "Tana River": [
    { from: "Hola", to: "CBD", matatu: 350, boda: 520, duration: "5 hr", trending: true, lastUpdated: "5 mins ago" },
    { from: "Hola", to: "Garsen", matatu: 80, boda: 120, duration: "35 min", trending: false, lastUpdated: "10 mins ago" },
    { from: "Hola", to: "Kipini", matatu: 100, boda: 150, duration: "45 min", trending: false, lastUpdated: "15 mins ago" },
  ],
  "Lamu": [
    { from: "Town", to: "CBD", matatu: 800, boda: 1200, duration: "12 hr", trending: true, lastUpdated: "5 mins ago" },
    { from: "Town", to: "Hindi", matatu: 80, boda: 120, duration: "35 min", trending: false, lastUpdated: "10 mins ago" },
    { from: "Town", to: "Kiunga", matatu: 100, boda: 150, duration: "45 min", trending: false, lastUpdated: "15 mins ago" },
  ],
  // Default fallback for counties not specifically listed
  "default": [
    { from: "Town Center", to: "CBD", matatu: 100, boda: 150, duration: "45 min", trending: true, lastUpdated: "5 mins ago" },
    { from: "Town Center", to: "Market", matatu: 50, boda: 70, duration: "20 min", trending: false, lastUpdated: "10 mins ago" },
    { from: "Town Center", to: "Hospital", matatu: 60, boda: 90, duration: "25 min", trending: false, lastUpdated: "15 mins ago" },
  ]
};

const Fares = () => {
  const [selectedCounty, setSelectedCounty] = useState("Nairobi");
  const [fares, setFares] = useState(countyFares["Nairobi"] || countyFares["default"]);
  const [mapModal, setMapModal] = useState({ isOpen: false, from: "", to: "" });
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // Update fares when county changes
  const updateCountyFares = (county: string) => {
    setSelectedCounty(county);
    const countyFareData = countyFares[county] || countyFares["default"];
    setFares(countyFareData);
  };

  const handleSearch = (query: string) => {
    const currentFares = countyFares[selectedCounty] || countyFares["default"];
    if (!query.trim()) {
      setFares(currentFares);
      return;
    }
    const filtered = currentFares.filter(
      (fare) =>
        fare.from.toLowerCase().includes(query.toLowerCase()) ||
        fare.to.toLowerCase().includes(query.toLowerCase())
    );
    setFares(filtered);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Real-Time Fare Tracker
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get accurate, up-to-date matatu and boda fares across Kenya. Community-powered, always current.
          </p>
        </div>

        {/* County Selector */}
        <div className="mb-6">
          <div className="bg-card p-4 rounded-lg border shadow-sm">
            <label className="text-sm font-medium text-foreground block mb-2">Select County</label>
            <Select value={selectedCounty} onValueChange={updateCountyFares}>
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue placeholder="Choose county" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(countyFares).filter(key => key !== "default").map((county) => (
                  <SelectItem key={county} value={county}>
                    {county}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Enhanced Route Search */}
        <div className="mb-8">
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">Find Your Route in {selectedCounty}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">From</label>
                <SearchBar
                  placeholder="Your starting location"
                  onSearch={() => {}}
                  onLocationSelect={(location) => {
                    // Parse route if it contains "to"
                    if (location.includes(" to ")) {
                      const [from, to] = location.split(" to ");
                      setMapModal(prev => ({ ...prev, from, to }));
                    } else {
                      setMapModal(prev => ({ ...prev, from: location }));
                    }
                  }}
                  showSuggestionsOnFocus={true}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">To</label>
                <SearchBar
                  placeholder="Your destination"
                  onSearch={() => {}}
                  onLocationSelect={(location) => {
                    // Parse route if it contains " to "
                    if (location.includes(" to ")) {
                      const [from, to] = location.split(" to ");
                      setMapModal(prev => ({ ...prev, from, to }));
                    } else {
                      setMapModal(prev => ({ ...prev, to: location }));
                    }
                  }}
                  showSuggestionsOnFocus={true}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        const userLocation = `${position.coords.latitude},${position.coords.longitude}`;
                        setMapModal(prev => ({ ...prev, from: userLocation, isOpen: true }));
                      },
                      () => {
                        setMapModal(prev => ({ ...prev, from: "Nairobi, CBD", isOpen: true }));
                      }
                    );
                  } else {
                    setMapModal(prev => ({ ...prev, from: "Nairobi, CBD", isOpen: true }));
                  }
                }}
                className="gap-2"
              >
                <MapPin className="w-4 h-4" />
                Use My Location
              </Button>
              <Button
                onClick={() => setMapModal(prev => ({ ...prev, isOpen: true }))}
                variant="outline"
                className="gap-2"
              >
                <MapPin className="w-4 h-4" />
                Get Directions
              </Button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <Button className="gap-2" onClick={() => setReportModalOpen(true)}>
            <Plus className="w-4 h-4" />
            Report Fare
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setMapModal({ isOpen: true, from: "CBD", to: "Rongai" })}
          >
            <MapPin className="w-4 h-4" />
            View Map
          </Button>
        </div>

        {/* Trending Fares Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">🔥 Trending Routes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fares
              .filter((fare) => fare.trending)
              .map((fare, index) => (
                <FareCard
                  key={index}
                  {...fare}
                  onViewRoute={(from, to) => setMapModal({ isOpen: true, from, to })}
                />
              ))}
          </div>
        </div>

        {/* All Fares Section */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">All Routes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fares.map((fare, index) => (
              <FareCard
                key={index}
                {...fare}
                onViewRoute={(from, to) => setMapModal({ isOpen: true, from, to })}
              />
            ))}
          </div>
        </div>

        {fares.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No fares found. Try a different search.</p>
          </div>
        )}
      </main>

      <Footer />

      <MapModal
        isOpen={mapModal.isOpen}
        onClose={() => setMapModal({ isOpen: false, from: "", to: "" })}
        from={mapModal.from}
        to={mapModal.to}
      />

      <ReportFareModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />
    </div>
  );
};

export default Fares;
