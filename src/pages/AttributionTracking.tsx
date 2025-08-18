import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import { PersonaAttributionTracking } from "@/components/dashboard/PersonaAttributionTracking";

export default function AttributionTracking() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />
        
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <PersonaAttributionTracking />
          </div>
        </div>
      </div>
    </div>
  );
}