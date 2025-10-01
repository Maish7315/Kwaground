import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onLocationSelect?: (location: string) => void;
  showSuggestionsOnFocus?: boolean;
}

// All 47 counties of Kenya
const kenyanCounties = [
  "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet", "Embu", "Garissa",
  "Homa Bay", "Isiolo", "Kajiado", "Kakamega", "Kericho", "Kiambu", "Kilifi",
  "Kirinyaga", "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia", "Lamu",
  "Machakos", "Makueni", "Mandera", "Marsabit", "Meru", "Migori", "Mombasa",
  "Murang'a", "Nairobi", "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua",
  "Nyeri", "Samburu", "Siaya", "Taita-Taveta", "Tana River", "Tharaka-Nithi",
  "Trans Nzoia", "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot"
];

// Popular routes for each county
const countyRoutes: Record<string, string[]> = {
  "Nairobi": [
    "CBD to Westlands", "CBD to Karen", "CBD to Kileleshwa", "Westlands to Karen",
    "CBD to Rongai", "CBD to Kasarani", "CBD to Eastleigh", "CBD to South B",
    "CBD to Ngong", "CBD to Thika Road", "Juja to CBD", "Thika to CBD",
    "Limuru to CBD", "Kiambu to CBD", "Ruiru to CBD"
  ],
  "Kisumu": [
    "Town to Mega City", "Town to Industrial Area", "Town to Kisumu Airport",
    "Town to Ahero", "Town to Muhoroni", "Town to Nyakach"
  ],
  "Mombasa": [
    "Nyali to CBD", "South Coast to CBD", "Kilifi to CBD", "Malindi to CBD",
    "Lamu to CBD", "Voi to CBD", "Taveta to CBD"
  ],
  "Nakuru": [
    "Town to Naivasha", "Town to Industrial Area", "Town to Gilgil",
    "Town to Elementaita", "Town to Molo"
  ],
  "Eldoret": [
    "Town to Moi University", "Town to Industrial Area", "Town to Turbo",
    "Town to Kapsabet", "Town to Kitale"
  ],
  "Uasin Gishu": [
    "Eldoret to Moi University", "Eldoret to Turbo", "Eldoret to Kapsabet", "Eldoret to Kitale"
  ],
  "Kiambu": [
    "Town to CBD", "Town to Limuru", "Town to Ruiru", "Town to Thika"
  ],
  "Machakos": [
    "Town to CBD", "Town to Athi River", "Town to Kangundo"
  ],
  "Kajiado": [
    "Town to CBD", "Town to Ngong", "Town to Kitengela"
  ],
  "Murang'a": [
    "Town to CBD", "Town to Thika", "Town to Kandara"
  ],
  "Nyeri": [
    "Town to CBD", "Town to Nanyuki", "Town to Karatina"
  ],
  "Kirinyaga": [
    "Town to CBD", "Town to Kerugoya", "Town to Sagana"
  ],
  "Embu": [
    "Town to CBD", "Town to Runyenjes", "Town to Siakago"
  ],
  "Kitui": [
    "Town to CBD", "Town to Mwingi", "Town to Mutomo"
  ],
  "Meru": [
    "Town to CBD", "Town to Maua", "Town to Chuka"
  ],
  "Tharaka-Nithi": [
    "Town to CBD", "Town to Chuka", "Town to Maara"
  ],
  "Laikipia": [
    "Nanyuki to CBD", "Nanyuki to Nyahururu", "Nanyuki to Dol Dol"
  ],
  "Isiolo": [
    "Town to CBD", "Town to Garbatulla", "Town to Merti"
  ],
  "Marsabit": [
    "Town to CBD", "Town to Moyale", "Town to Sololo"
  ],
  "Wajir": [
    "Town to CBD", "Town to Habaswein", "Town to Wajir Bor"
  ],
  "Garissa": [
    "Town to CBD", "Town to Dadaab", "Town to Ijara"
  ],
  "Mandera": [
    "Town to CBD", "Town to El Wak", "Town to Takaba"
  ],
  "Bungoma": [
    "Town to CBD", "Town to Webuye", "Town to Malakisi"
  ],
  "Busia": [
    "Town to CBD", "Town to Malaba", "Town to Port Victoria"
  ],
  "Siaya": [
    "Town to CBD", "Town to Bondo", "Town to Yala"
  ],
  "Kakamega": [
    "Town to CBD", "Town to Mumias", "Town to Butere"
  ],
  "Vihiga": [
    "Town to CBD", "Town to Chavakali", "Town to Luanda"
  ],
  "Nandi": [
    "Kapsabet to CBD", "Kapsabet to Nandi Hills", "Kapsabet to Mosoriot"
  ],
  "Trans Nzoia": [
    "Kitale to CBD", "Kitale to Endebess", "Kitale to Kwanza"
  ],
  "West Pokot": [
    "Kapenguria to CBD", "Kapenguria to Ortum", "Kapenguria to Sigor"
  ],
  "Samburu": [
    "Maralal to CBD", "Maralal to Baragoi", "Maralal to Wamba"
  ],
  "Turkana": [
    "Lodwar to CBD", "Lodwar to Kakuma", "Lodwar to Lokichoggio"
  ],
  "Narok": [
    "Town to CBD", "Town to Kilgoris", "Town to Ololulung'a"
  ],
  "Kericho": [
    "Town to CBD", "Town to Kipkelion", "Town to Londiani"
  ],
  "Bomet": [
    "Town to CBD", "Town to Sotik", "Town to Chepalungu"
  ],
  "Homa Bay": [
    "Town to CBD", "Town to Mbita", "Town to Ndhiwa"
  ],
  "Migori": [
    "Town to CBD", "Town to Isebania", "Town to Kehancha"
  ],
  "Kisii": [
    "Town to CBD", "Town to Keroka", "Town to Nyamache"
  ],
  "Nyamira": [
    "Town to CBD", "Town to Manga", "Town to Nyansiongo"
  ],
  "Taita Taveta": [
    "Voi to CBD", "Voi to Taveta", "Voi to Mwatate"
  ],
  "Kwale": [
    "Ukunda to CBD", "Ukunda to Diani", "Ukunda to Lunga Lunga"
  ],
  "Kilifi": [
    "Town to CBD", "Town to Malindi", "Town to Watamu"
  ],
  "Tana River": [
    "Hola to CBD", "Hola to Garsen", "Hola to Kipini"
  ],
  "Lamu": [
    "Town to CBD", "Town to Hindi", "Town to Kiunga"
  ]
};

const SearchBar = ({ placeholder = "Search routes or locations...", onSearch, onLocationSelect, showSuggestionsOnFocus = false }: SearchBarProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search") as string;
    onSearch?.(query);
    setShowSuggestions(false);
  };

  const handleLocationSelect = (location: string) => {
    setSearchValue(location);
    setShowSuggestions(false);
    onLocationSelect?.(location);
  };

  const handleInputFocus = () => {
    if (showSuggestionsOnFocus) {
      setShowSuggestions(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setShowSuggestions(true);
  };

  const filteredCounties = kenyanCounties.filter(county =>
    county.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Get routes for the matched county
  const matchedCounty = kenyanCounties.find(county =>
    county.toLowerCase() === searchValue.toLowerCase()
  );
  const countyRoutesList = matchedCounty ? countyRoutes[matchedCounty] || [] : [];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
          <Input
            name="search"
            type="text"
            placeholder={placeholder}
            value={searchValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            className="pl-10 h-12 text-base border-2 focus:border-primary"
          />
        </div>
        <Button type="submit" size="lg" className="h-12 px-6">
          Search
        </Button>
      </form>

      {/* Autocomplete dropdown */}
      {showSuggestions && (
        <div className="mt-2">
          <Command className="rounded-lg border shadow-md">
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>

              {/* Show routes if county is matched */}
              {countyRoutesList.length > 0 && (
                <CommandGroup heading={`Popular Routes in ${matchedCounty}`}>
                  {countyRoutesList.slice(0, 8).map((route) => (
                    <CommandItem
                      key={route}
                      onSelect={() => handleLocationSelect(route)}
                      className="cursor-pointer"
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      {route}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {/* Show counties if no routes or if searching */}
              <CommandGroup heading="Kenyan Counties">
                {filteredCounties.slice(0, countyRoutesList.length > 0 ? 5 : 10).map((county) => (
                  <CommandItem
                    key={county}
                    onSelect={() => handleLocationSelect(county)}
                    className="cursor-pointer"
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    {county}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
