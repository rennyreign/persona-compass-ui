import { useState, useMemo } from "react";
import { Users, FileText, DollarSign, GraduationCap } from "lucide-react";
import { KPICard } from "./KPICard";
import { ActivityFeed } from "./ActivityFeed";
import { PersonaFilterTabs } from "./PersonaFilterTabs";
import { PersonaGrid } from "./PersonaGrid";
import { mockPersonas, mockActivities, getKPIs, Persona } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface DashboardProps {
  className?: string;
}

export function Dashboard({ className }: DashboardProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  
  const kpis = getKPIs();

  const filteredPersonas = useMemo(() => {
    switch (activeFilter) {
      case 'all':
        return mockPersonas;
      case 'active':
        return mockPersonas.filter(p => p.isActive);
      default:
        return mockPersonas.filter(p => p.program === activeFilter);
    }
  }, [activeFilter]);

  const handlePersonaClick = (persona: Persona) => {
    window.location.href = `/persona/${persona.id}`;
  };

  return (
    <div className={cn("space-y-8", className)}>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Personas"
          value={kpis.totalPersonas}
          change={{ value: 12, period: "this month" }}
          trend="up"
          icon={<Users className="w-6 h-6" />}
        />
        <KPICard
          title="Application Rate"
          value="18.5%"
          change={{ value: 3.2, period: "vs last month" }}
          trend="up"
          icon={<FileText className="w-6 h-6" />}
        />
        <KPICard
          title="Avg CPL"
          value={`$${kpis.avgCPL.toFixed(2)}`}
          change={{ value: -5, period: "vs last month" }}
          trend="up"
          icon={<DollarSign className="w-6 h-6" />}
        />
        <KPICard
          title="Enrollment Rate"
          value="12.3%"
          change={{ value: 1.8, period: "vs last month" }}
          trend="up"
          icon={<GraduationCap className="w-6 h-6" />}
        />
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Filter Tabs */}
        <PersonaFilterTabs
          personas={mockPersonas}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        
        {/* Personas Grid */}
        <PersonaGrid
          personas={filteredPersonas}
          onPersonaClick={handlePersonaClick}
        />
      </div>

    </div>
  );
}