import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Persona } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface PersonaFilterTabsProps {
  personas: Persona[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  className?: string;
}

export function PersonaFilterTabs({ personas, activeFilter, onFilterChange, className }: PersonaFilterTabsProps) {
  const programs = Array.from(new Set(personas.map(p => p.program)));
  
  const getFilterCount = (filter: string) => {
    if (filter === 'all') return personas.length;
    if (filter === 'active') return personas.filter(p => p.isActive).length;
    return personas.filter(p => p.program === filter).length;
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Tabs value={activeFilter} onValueChange={onFilterChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:flex lg:w-auto bg-muted/50 p-1 h-auto rounded-xl">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4 py-2"
          >
            <span className="flex items-center space-x-2">
              <span>All Personas</span>
              <Badge variant="secondary" className="ml-2 bg-background/80">
                {getFilterCount('all')}
              </Badge>
            </span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="active" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4 py-2"
          >
            <span className="flex items-center space-x-2">
              <span>Active</span>
              <Badge variant="secondary" className="ml-2 bg-background/80">
                {getFilterCount('active')}
              </Badge>
            </span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Program Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {programs.map((program) => (
          <button
            key={program}
            onClick={() => onFilterChange(program)}
            className={cn(
              "inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
              activeFilter === program
                ? "bg-accent text-accent-foreground shadow-sm"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {program}
            <Badge 
              variant="outline" 
              className={cn(
                "ml-2 border-0",
                activeFilter === program 
                  ? "bg-accent-light/20 text-accent-foreground" 
                  : "bg-background/80"
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