import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Persona } from "@/types/persona";
import { formatPersonaAttribute } from '@/utils/formatPersonaAttributes';

interface PersonaGridProps {
  personas: Persona[];
  className?: string;
  onPersonaClick?: (persona: Persona) => void;
}

export function PersonaGrid({ personas, className, onPersonaClick }: PersonaGridProps) {
  // PersonaGrid rendered with personas: ${personas.length}
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
        <Card key={persona.id} className="persona-card group overflow-hidden">
          {/* Simplified Card Layout */}
          <div className="aspect-[4/3] w-full overflow-hidden relative">
            <img 
              src={persona.avatar_url || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face`}
              alt={persona.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Overlay with key info on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 right-4">
                {persona.preferred_channels && persona.preferred_channels.length > 0 && (
                  <div className="flex gap-1 mb-2">
                    {persona.preferred_channels.slice(0, 3).map((channel) => (
                      <div key={channel} className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-medium">
                          {channel === 'LinkedIn' ? 'Li' : channel === 'Facebook' ? 'Fb' : channel.slice(0, 2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Minimal Content */}
          <div className="p-5 space-y-3">
            {/* Header */}
            <div className="space-y-1">
              <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                {persona.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {persona.age_range} • {persona.occupation}
              </p>
            </div>

            {/* Compact Tags */}
            <div className="flex flex-wrap gap-1.5">
              {persona.program_category && (
                <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20 px-2 py-0.5">
                  {persona.program_category}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs bg-muted text-muted-foreground border-border/50 px-2 py-0.5">
                {typeof persona.organization === 'string' ? persona.organization : persona.organization?.name || 'University'}
              </Badge>
            </div>

            {/* Action Button */}
            <Button 
              asChild
              variant="ghost" 
              size="sm"
              className="w-full mt-3 text-primary hover:bg-primary/10 hover:text-primary font-medium"
            >
              <Link to={`/persona/${persona.id}`}>
                View Profile →
              </Link>
            </Button>
          </div>
        </Card>
      ))}

      {/* Add New Persona Card */}
      <Link to="/create-persona">
        <Card className="persona-card group border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 cursor-pointer">
          <div className="flex flex-col items-center justify-center h-full min-h-[280px] space-y-4 text-center p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
              <span className="text-xl text-primary font-light">+</span>
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-foreground">Create Persona</h3>
              <p className="text-xs text-muted-foreground">
                Add a new targeting profile
              </p>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
}