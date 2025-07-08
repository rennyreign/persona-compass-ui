import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import { Dashboard } from "@/components/dashboard/Dashboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <TopHeader />
        
        {/* Dashboard Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Dashboard />
        </main>
      </div>
    </div>
  );
};

export default Index;
