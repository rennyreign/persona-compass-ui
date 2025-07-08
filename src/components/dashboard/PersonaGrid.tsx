import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Persona } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface PersonaGridProps {
  personas: Persona[];
  className?: string;
  onPersonaClick?: (persona: Persona) => void;
}

export function PersonaGrid({ personas, className, onPersonaClick }: PersonaGridProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
  };

  const formatCPL = (cpl: number) => {
    return `$${cpl.toFixed(2)}`;
  };

  const formatCTR = (ctr: number) => {
    return `${ctr.toFixed(1)}%`;
  };

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", className)}>
      {personas.map((persona) => (
        <Card key={persona.id} className="bg-card border-0 shadow-md rounded-2xl hover:shadow-lg transition-all duration-200 hover:-translate-y-1 overflow-hidden">
          <div className="space-y-0">
            {/* Hero Image */}
            <div className="aspect-video w-full overflow-hidden">
              <img 
                src={`https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop&crop=face`}
                alt={persona.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{persona.name}</h3>
                  <p className="text-sm text-muted-foreground">{persona.ageRange} • {persona.careerStage}</p>
                </div>
                <Badge 
                  variant={persona.isActive ? "default" : "secondary"}
                  className={persona.isActive ? "bg-success text-success-foreground" : ""}
                >
                  {persona.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

            {/* Program & Tagline */}
            <div className="space-y-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {persona.program}
              </Badge>
              <p className="text-sm text-muted-foreground italic">
                "{persona.motivationalTagline}"
              </p>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-xl">
              <div className="text-center">
                <p className="text-lg font-semibold text-foreground">{formatCPL(persona.performance.cpl)}</p>
                <p className="text-xs text-muted-foreground">CPL</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-foreground">{formatCTR(persona.performance.ctr)}</p>
                <p className="text-xs text-muted-foreground">CTR</p>
              </div>
            </div>

            {/* Channels */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Channels</p>
              <div className="flex flex-wrap gap-1">
                {persona.channels.slice(0, 3).map((channel) => (
                  <Badge key={channel} variant="secondary" className="text-xs bg-secondary/60">
                    {channel}
                  </Badge>
                ))}
                {persona.channels.length > 3 && (
                  <Badge variant="secondary" className="text-xs bg-secondary/60">
                    +{persona.channels.length - 3}
                  </Badge>
                )}
              </div>
            </div>

              {/* Action Button */}
              <Button 
                variant="outline" 
                className="w-full border-primary/20 hover:bg-primary hover:text-primary-foreground"
                onClick={() => onPersonaClick?.(persona)}
              >
                View Profile
              </Button>
            </div>
          </div>
        </Card>
      ))}

      {/* Add New Persona Card */}
      <Link to="/create-persona">
        <Card className="p-6 bg-card border-2 border-dashed border-muted-foreground/20 rounded-2xl hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 cursor-pointer group">
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] space-y-4 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
              <span className="text-2xl text-primary">+</span>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Create New Persona</h3>
              <p className="text-sm text-muted-foreground">
                Add a new student persona to target with precision
              </p>
            </div>
            <Button variant="outline" className="border-primary/40 hover:bg-primary hover:text-primary-foreground">
              Get Started
            </Button>
          </div>
        </Card>
      </Link>
    </div>
  );
}