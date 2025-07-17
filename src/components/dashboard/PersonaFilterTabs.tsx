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
    <div className={cn("space-y-4", className)}>
      {/* Status Filter Pills */}
      <div className="flex flex-wrap gap-2 bg-muted/50 p-3 rounded-xl">
        <button
          onClick={() => onStatusFilterChange('all')}
          className={cn(
            "inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
            statusFilter === 'all'
              ? "bg-blue-100 text-blue-800 border border-blue-200 shadow-sm"
              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          All Status
          <Badge 
            variant="outline" 
            className={cn(
              "ml-2 border-0",
              statusFilter === 'all' 
                ? "bg-blue-50 text-blue-700" 
                : "bg-muted text-muted-foreground"
            )}
          >
            {getStatusCount('all')}
          </Badge>
        </button>
        
        <button
          onClick={() => onStatusFilterChange('active')}
          className={cn(
            "inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
            statusFilter === 'active'
              ? "bg-green-100 text-green-800 border border-green-200 shadow-sm"
              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          Active
          <Badge 
            variant="outline" 
            className={cn(
              "ml-2 border-0",
              statusFilter === 'active' 
                ? "bg-green-50 text-green-700" 
                : "bg-muted text-muted-foreground"
            )}
          >
            {getStatusCount('active')}
          </Badge>
        </button>
        
        <button
          onClick={() => onStatusFilterChange('inactive')}
          className={cn(
            "inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
            statusFilter === 'inactive'
              ? "bg-red-100 text-red-800 border border-red-200 shadow-sm"
              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          Inactive
          <Badge 
            variant="outline" 
            className={cn(
              "ml-2 border-0",
              statusFilter === 'inactive' 
                ? "bg-red-50 text-red-700" 
                : "bg-muted text-muted-foreground"
            )}
          >
            {getStatusCount('inactive')}
          </Badge>
        </button>
      </div>


      {/* Program Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {availablePrograms.map((program) => (
          <button
            key={program}
            onClick={() => onFilterChange(program)}
            className={cn(
              "inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
              activeFilter === program
                ? "bg-green-100 text-green-800 border border-green-200 shadow-sm"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {program}
            <Badge 
              variant="outline" 
              className={cn(
                "ml-2 border-0",
                activeFilter === program 
                  ? "bg-green-50 text-green-700" 
                  : "bg-muted text-muted-foreground"
              )}
            >
              {getFilterCount(program)}
            </Badge>
          </button>
        ))}
      </div>
    </div>
  );
}