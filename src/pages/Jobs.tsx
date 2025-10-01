import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PostJobModal from "@/components/PostJobModal";
import ApplyJobModal from "@/components/ApplyJobModal";
import SearchBar from "@/components/SearchBar";
import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Plus, Filter, MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Expanded job database with more locations and types
const mockJobs = [
  // Nairobi jobs
  { title: "Boda Boda Rider Needed", location: "Nairobi, CBD", pay: "Ksh 1,500/day", type: "Transport", description: "Need experienced boda rider for deliveries around CBD area. Must have own bike.", postedTime: "2 hours ago", urgent: true, coordinates: [-1.2864, 36.8172] },
  { title: "Waiter/Waitress", location: "Nairobi, Westlands", pay: "Ksh 800/day", type: "Hospitality", description: "Busy restaurant needs servers for evening shifts. Experience preferred.", postedTime: "3 hours ago", urgent: false, coordinates: [-1.2630, 36.8065] },
  { title: "Security Guard", location: "Nairobi, Karen", pay: "Ksh 18,000/month", type: "Security", description: "Night shift security guard needed for residential area. Experience required.", postedTime: "1 day ago", urgent: false, coordinates: [-1.3167, 36.7833] },
  { title: "House Help", location: "Nairobi, Kileleshwa", pay: "Ksh 15,000/month", type: "Domestic", description: "Live-in house help needed for family of 4. Must be trustworthy and hardworking.", postedTime: "2 days ago", urgent: false, coordinates: [-1.2833, 36.7833] },
  { title: "Cleaner", location: "Nairobi, CBD", pay: "Ksh 600/day", type: "Cleaning", description: "Office cleaning position available. No experience needed, training provided.", postedTime: "4 hours ago", urgent: true, coordinates: [-1.2864, 36.8172] },

  // Kisumu jobs
  { title: "Construction Workers", location: "Kisumu, Town", pay: "Ksh 800/day", type: "Mjengo", description: "Building project needs 5 workers for 2 weeks. Accommodation provided.", postedTime: "4 hours ago", urgent: false, coordinates: [-0.0917, 34.7679] },
  { title: "Shop Attendant", location: "Kisumu, Mega City", pay: "Ksh 700/day", type: "Retail", description: "Supermarket needs sales attendants. Customer service experience preferred.", postedTime: "6 hours ago", urgent: false, coordinates: [-0.0917, 34.7679] },
  { title: "Mechanic", location: "Kisumu, Industrial Area", pay: "Ksh 1,200/day", type: "Technical", description: "Experienced vehicle mechanic needed for busy garage.", postedTime: "1 day ago", urgent: false, coordinates: [-0.0917, 34.7679] },

  // Mombasa jobs
  { title: "Delivery Driver", location: "Mombasa, Nyali", pay: "Ksh 2,000/day", type: "Driving", description: "Need driver with valid license for local deliveries. Fuel provided.", postedTime: "5 hours ago", urgent: false, coordinates: [-4.0435, 39.6682] },
  { title: "Beach Vendor", location: "Mombasa, South Coast", pay: "Ksh 1,000/day", type: "Sales", description: "Sell souvenirs and refreshments at popular beach. Commission based.", postedTime: "3 hours ago", urgent: true, coordinates: [-4.0435, 39.6682] },
  { title: "Hotel Housekeeper", location: "Mombasa, Kilifi", pay: "Ksh 900/day", type: "Hospitality", description: "Beach resort needs housekeeping staff. Accommodation available.", postedTime: "8 hours ago", urgent: false, coordinates: [-3.6305, 39.8499] },

  // Nakuru jobs
  { title: "Farm Workers", location: "Nakuru, Naivasha", pay: "Ksh 600/day", type: "Farming", description: "Flower farm needs casual workers for harvesting. Transport provided.", postedTime: "3 hours ago", urgent: true, coordinates: [-0.3031, 36.0800] },
  { title: "Warehouse Assistant", location: "Nakuru, Industrial Area", pay: "Ksh 750/day", type: "Logistics", description: "Loading and unloading goods in warehouse. Physical fitness required.", postedTime: "5 hours ago", urgent: false, coordinates: [-0.3031, 36.0800] },

  // Eldoret jobs
  { title: "University Cleaner", location: "Eldoret, Moi University", pay: "Ksh 650/day", type: "Cleaning", description: "Campus cleaning position. Regular hours, benefits included.", postedTime: "1 day ago", urgent: false, coordinates: [0.5143, 35.2698] },
  { title: "Car Wash Attendant", location: "Eldoret, Town", pay: "Ksh 500/day", type: "Services", description: "Car wash business needs attendants. Tips available.", postedTime: "6 hours ago", urgent: false, coordinates: [0.5143, 35.2698] },

  // Other locations
  { title: "Road Construction Worker", location: "Thika, Bypass", pay: "Ksh 850/day", type: "Mjengo", description: "Highway construction project. Safety gear provided.", postedTime: "2 hours ago", urgent: true, coordinates: [-1.0388, 37.0834] },
  { title: "Barista", location: "Meru, Town", pay: "Ksh 900/day", type: "Hospitality", description: "Coffee shop needs experienced barista. Training available.", postedTime: "4 hours ago", urgent: false, coordinates: [0.0476, 37.6459] },
];

const Jobs = () => {
  const [jobs, setJobs] = useState(mockJobs);
  const [jobType, setJobType] = useState("all");
  const [location, setLocation] = useState("all");
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [userCoordinates, setUserCoordinates] = useState<[number, number] | null>(null);
  const [searchRadius, setSearchRadius] = useState(50); // km
  const [postJobModalOpen, setPostJobModalOpen] = useState(false);
  const [applyJobModalOpen, setApplyJobModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<{ title: string; location: string; pay: string; type: string } | null>(null);

  // Get user's location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
          setUserCoordinates(coords);
          // Try to determine user's county based on coordinates
          const userCounty = getCountyFromCoordinates(coords);
          setUserLocation(userCounty);
          setLocation(userCounty || "all");
        },
        () => {
          // Default to Nairobi if geolocation fails
          setUserLocation("Nairobi");
          setLocation("Nairobi");
        }
      );
    }
  }, []);

  // Function to determine county from coordinates (simplified)
  const getCountyFromCoordinates = (coords: [number, number]): string | null => {
    const [lat, lng] = coords;

    // Nairobi area
    if (lat >= -1.5 && lat <= -1.0 && lng >= 36.5 && lng <= 37.0) return "Nairobi";
    // Kisumu area
    if (lat >= -0.2 && lat <= 0.0 && lng >= 34.5 && lng <= 35.0) return "Kisumu";
    // Mombasa area
    if (lat >= -4.2 && lat <= -3.8 && lng >= 39.4 && lng <= 39.8) return "Mombasa";
    // Nakuru area
    if (lat >= -0.4 && lat <= -0.2 && lng >= 35.8 && lng <= 36.2) return "Nakuru";
    // Eldoret area
    if (lat >= 0.4 && lat <= 0.6 && lng >= 35.1 && lng <= 35.4) return "Uasin Gishu";

    return null;
  };

  // Calculate distance between two coordinates
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

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      filterJobs("all", "all");
      return;
    }
    const filtered = mockJobs.filter(
      (job) =>
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.description.toLowerCase().includes(query.toLowerCase()) ||
        job.location.toLowerCase().includes(query.toLowerCase())
    );
    setJobs(filtered);
  };

  const filterJobs = (type: string, loc: string) => {
    let filtered = mockJobs;

    if (type !== "all") {
      filtered = filtered.filter((job) => job.type === type);
    }

    if (loc !== "all") {
      filtered = filtered.filter((job) => job.location.includes(loc));
    }

    // If user coordinates are available, filter by distance
    if (userCoordinates && loc === userLocation) {
      filtered = filtered.filter((job) => {
        const distance = calculateDistance(
          userCoordinates[0],
          userCoordinates[1],
          job.coordinates[0],
          job.coordinates[1]
        );
        return distance <= searchRadius;
      });
    }

    setJobs(filtered);
  };

  const handleTypeChange = (value: string) => {
    setJobType(value);
    filterJobs(value, location);
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    filterJobs(jobType, value);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Find Your Hustle
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse thousands of casual jobs across Kenya. From boda rides to construction, your next opportunity is here.
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <SearchBar
            placeholder="Search jobs by type or location (e.g., construction, Nairobi)"
            onSearch={handleSearch}
            onLocationSelect={(location) => {
              setLocation(location);
              filterJobs(jobType, location);
            }}
            showSuggestionsOnFocus={true}
          />
          {userLocation && (
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>Searching jobs near {userLocation}</span>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <Select value={jobType} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Job Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Transport">Transport</SelectItem>
              <SelectItem value="Mjengo">Construction</SelectItem>
              <SelectItem value="Domestic">Domestic Work</SelectItem>
              <SelectItem value="Farming">Farming</SelectItem>
              <SelectItem value="Driving">Driving</SelectItem>
              <SelectItem value="Security">Security</SelectItem>
              <SelectItem value="Hospitality">Hospitality</SelectItem>
              <SelectItem value="Retail">Retail</SelectItem>
              <SelectItem value="Technical">Technical</SelectItem>
              <SelectItem value="Cleaning">Cleaning</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="Services">Services</SelectItem>
              <SelectItem value="Logistics">Logistics</SelectItem>
            </SelectContent>
          </Select>

          <Select value={location} onValueChange={handleLocationChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="Nairobi">Nairobi</SelectItem>
              <SelectItem value="Kisumu">Kisumu</SelectItem>
              <SelectItem value="Eldoret">Eldoret</SelectItem>
              <SelectItem value="Mombasa">Mombasa</SelectItem>
              <SelectItem value="Nakuru">Nakuru</SelectItem>
            </SelectContent>
          </Select>

          <Button className="gap-2" onClick={() => setPostJobModalOpen(true)}>
            <Plus className="w-4 h-4" />
            Post Job
          </Button>
        </div>

        {/* Urgent Jobs Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">⚡ Urgent Jobs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs
              .filter((job) => job.urgent)
              .map((job, index) => (
                <JobCard
                  key={index}
                  {...job}
                  onApply={(jobDetails) => {
                    setSelectedJob(jobDetails);
                    setApplyJobModalOpen(true);
                  }}
                />
              ))}
          </div>
        </div>

        {/* All Jobs Section */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">All Jobs ({jobs.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job, index) => (
              <JobCard
                key={index}
                {...job}
                onApply={(jobDetails) => {
                  setSelectedJob(jobDetails);
                  setApplyJobModalOpen(true);
                }}
              />
            ))}
          </div>
        </div>

        {jobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No jobs found. Try adjusting your filters.</p>
          </div>
        )}
      </main>

      <Footer />

      <PostJobModal
        isOpen={postJobModalOpen}
        onClose={() => setPostJobModalOpen(false)}
      />

      <ApplyJobModal
        isOpen={applyJobModalOpen}
        onClose={() => setApplyJobModalOpen(false)}
        jobDetails={selectedJob}
      />
    </div>
  );
};

export default Jobs;
