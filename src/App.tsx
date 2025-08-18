import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import CreatePersona from "./pages/CreatePersona";
import PersonaProfile from "./pages/PersonaProfile";
import EditPersona from "./pages/EditPersona";
import CampaignPlan from "./pages/CampaignPlan";
import Campaigns from "./pages/Campaigns";
import Performance from "./pages/Performance";
import Insights from "./pages/Insights";
import AttributionTracking from "./pages/AttributionTracking";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/create-persona" element={
              <ProtectedRoute>
                <CreatePersona />
              </ProtectedRoute>
            } />
            <Route path="/persona/:id" element={
              <ProtectedRoute>
                <PersonaProfile />
              </ProtectedRoute>
            } />
            <Route path="/persona/:id/edit" element={
              <ProtectedRoute>
                <EditPersona />
              </ProtectedRoute>
            } />
            <Route path="/campaign/:campaignId" element={
              <ProtectedRoute>
                <CampaignPlan />
              </ProtectedRoute>
            } />
            <Route path="/campaigns" element={
              <ProtectedRoute>
                <Campaigns />
              </ProtectedRoute>
            } />
            <Route path="/performance" element={
              <ProtectedRoute>
                <Performance />
              </ProtectedRoute>
            } />
            <Route path="/insights" element={
              <ProtectedRoute>
                <Insights />
              </ProtectedRoute>
            } />
            <Route path="/attribution" element={
              <ProtectedRoute>
                <AttributionTracking />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
