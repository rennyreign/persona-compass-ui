import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Persona } from "@/types/persona";

interface PersonaFilterTabsProps {
  personas: Persona[];
  availablePrograms: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  className?: string;
}

export function PersonaFilterTabs({ personas, availablePrograms, activeFilter, onFilterChange, className }: PersonaFilterTabsProps) {
  const getFilterCount = (filter: string): number => {
    if (filter === 'all') {
      return personas.length;
    }
    return personas.filter(p => p.program_category === filter).length;
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Tabs value={activeFilter} onValueChange={onFilterChange} className="w-full">
        <TabsList className="grid w-full grid-cols-1 lg:flex lg:w-auto bg-muted/50 p-1 h-auto rounded-xl">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4 py-2"
          >
            <span className="flex items-center space-x-2">
              <span>All Personas</span>
              <Badge variant="secondary" className="ml-2 bg-muted text-muted-foreground">
                {getFilterCount('all')}
              </Badge>
            </span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

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