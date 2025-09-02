import React from 'react';
import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import { ORDAEControlPanel } from "@/components/control-panel/ORDAEControlPanel";

export default function ControlPanel() {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopHeader />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <ORDAEControlPanel />
          </div>
        </main>
      </div>
    </div>
  );
}
