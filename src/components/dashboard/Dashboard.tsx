import { useState, useMemo } from "react";
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
    console.log('Navigate to persona profile:', persona.id);
    // TODO: Navigate to persona profile page
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
          icon={<span className="text-2xl">👥</span>}
        />
        <KPICard
          title="Active Campaigns"
          value={kpis.activeCampaigns}
          change={{ value: 8, period: "this week" }}
          trend="up"
          icon={<span className="text-2xl">📢</span>}
        />
        <KPICard
          title="Avg CPL"
          value={`$${kpis.avgCPL.toFixed(2)}`}
          change={{ value: -5, period: "vs last month" }}
          trend="up"
          icon={<span className="text-2xl">💰</span>}
        />
        <KPICard
          title="AI Insights"
          value={kpis.totalInsights}
          change={{ value: 23, period: "this week" }}
          trend="up"
          icon={<span className="text-2xl">🤖</span>}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Personas */}
        <div className="lg:col-span-2 space-y-6">
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

        {/* Right Column - Activity Feed */}
        <div className="lg:col-span-1">
          <ActivityFeed activities={mockActivities} />
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Campaign Performance Chart Placeholder */}
        <div className="bg-card p-6 rounded-2xl shadow-md border-0">
          <h3 className="text-lg font-semibold text-foreground mb-4">Campaign Performance</h3>
          <div className="h-64 bg-muted/30 rounded-xl flex items-center justify-center">
            <div className="text-center space-y-2">
              <span className="text-4xl">📊</span>
              <p className="text-sm text-muted-foreground">Performance charts coming soon</p>
            </div>
          </div>
        </div>

        {/* Channel Distribution Placeholder */}
        <div className="bg-card p-6 rounded-2xl shadow-md border-0">
          <h3 className="text-lg font-semibold text-foreground mb-4">Channel Distribution</h3>
          <div className="h-64 bg-muted/30 rounded-xl flex items-center justify-center">
            <div className="text-center space-y-2">
              <span className="text-4xl">📈</span>
              <p className="text-sm text-muted-foreground">Channel analytics coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}