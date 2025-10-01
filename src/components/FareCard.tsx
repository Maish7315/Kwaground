import { MapPin, Navigation, Clock, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FareCardProps {
  from: string;
  to: string;
  matatu: number;
  boda: number;
  duration: string;
  trending?: boolean;
  lastUpdated: string;
  onViewRoute?: (from: string, to: string) => void;
}

const FareCard = ({ from, to, matatu, boda, duration, trending, lastUpdated, onViewRoute }: FareCardProps) => {
  return (
    <Card className="p-4 hover:shadow-card-hover transition-all duration-300 border-2 hover:border-primary">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">{from}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Navigation className="w-4 h-4" />
            <span className="text-sm">to {to}</span>
          </div>
        </div>
        {trending && (
          <Badge className="bg-gradient-secondary border-0">
            <TrendingUp className="w-3 h-3 mr-1" />
            Trending
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-muted rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-1">Matatu</p>
          <p className="text-xl font-bold text-foreground">Ksh {matatu}</p>
        </div>
        <div className="bg-muted rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-1">Boda</p>
          <p className="text-xl font-bold text-foreground">Ksh {boda}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{duration}</span>
        </div>
        <span>Updated {lastUpdated}</span>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => onViewRoute?.(from, to)}
      >
        View Route
      </Button>
    </Card>
  );
};

export default FareCard;
