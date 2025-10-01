import { MapPin, Clock, DollarSign, Share2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface JobCardProps {
  title: string;
  location: string;
  pay: string;
  type: string;
  description: string;
  postedTime: string;
  urgent?: boolean;
  onApply?: (job: { title: string; location: string; pay: string; type: string }) => void;
}

const JobCard = ({ title, location, pay, type, description, postedTime, urgent, onApply }: JobCardProps) => {
  return (
    <Card className="p-4 hover:shadow-card-hover transition-all duration-300 border-2 hover:border-primary">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-foreground mb-1">{title}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
        </div>
        {urgent && (
          <Badge variant="destructive">
            Urgent
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Badge variant="secondary">{type}</Badge>
        <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
          <DollarSign className="w-4 h-4 text-primary" />
          <span>{pay}</span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{postedTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button size="sm" onClick={() => onApply?.({ title, location, pay, type })}>
            Apply Now
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default JobCard;
