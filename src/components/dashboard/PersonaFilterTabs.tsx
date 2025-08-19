import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Persona } from "@/types/persona";

interface PersonaFilterTabsProps {
  personas: Persona[];
  availablePrograms: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  className?: string;
}

export function PersonaFilterTabs({ personas, availablePrograms, activeFilter, onFilterChange, statusFilter, onStatusFilterChange, className }: PersonaFilterTabsProps) {
  const getFilterCount = (filter: string): number => {
    const statusFilteredPersonas = statusFilter === 'all' 
      ? personas 
      : personas.filter(p => p.status === statusFilter);
    
    if (filter === 'all') {
      return statusFilteredPersonas.length;
    }
    return statusFilteredPersonas.filter(p => p.program_category === filter).length;
  };

  const getStatusCount = (status: string): number => {
    if (status === 'all') {
      return personas.length;
    }
    return personas.filter(p => p.status === status).length;
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Combined Filter Section - More minimal approach */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">Filter:</span>
          {/* Status Filter Pills */}
          <div className="flex gap-1">
            {['all', 'active', 'inactive'].map((status) => (
              <button
                key={status}
                onClick={() => onStatusFilterChange(status)}
                className={cn(
                  "filter-pill",
                  statusFilter === status 
                    ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                    : "bg-card text-muted-foreground border-border/60 hover:border-primary/50 hover:bg-card/80"
                )}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full bg-primary/10">
                  {getStatusCount(status)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Program Category Pills - Only show if there are programs */}
        {availablePrograms.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onFilterChange('all')}
              className={cn(
                "filter-pill",
                activeFilter === 'all' 
                  ? "bg-secondary text-secondary-foreground border-secondary" 
                  : "bg-card text-muted-foreground border-border/60 hover:border-secondary/50"
              )}
            >
              All Programs
              <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full bg-secondary/10">
                {getFilterCount('all')}
              </span>
            </button>
            {availablePrograms.slice(0, 3).map((program) => (
              <button
                key={program}
                onClick={() => onFilterChange(program)}
                className={cn(
                  "filter-pill",
                  activeFilter === program 
                    ? "bg-secondary text-secondary-foreground border-secondary" 
                    : "bg-card text-muted-foreground border-border/60 hover:border-secondary/50"
                )}
              >
                {program}
                <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full bg-secondary/10">
                  {getFilterCount(program)}
                </span>
              </button>
            ))}
            {availablePrograms.length > 3 && (
              <span className="text-xs text-muted-foreground ml-2">
                +{availablePrograms.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}