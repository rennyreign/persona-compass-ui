import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import React, { Suspense } from "react";
// Eager-load only the essential pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";

// Lazy-load heavier/less frequently used pages to avoid app-wide crashes on module errors
const CreatePersona = React.lazy(() => import("./pages/CreatePersona"));
const PersonaProfile = React.lazy(() => import("./pages/PersonaProfile"));
const EditPersona = React.lazy(() => import("./pages/EditPersona"));
const CampaignPlan = React.lazy(() => import("./pages/CampaignPlan"));
const Campaigns = React.lazy(() => import("./pages/Campaigns"));
const Performance = React.lazy(() => import("./pages/Performance"));
const Insights = React.lazy(() => import("./pages/Insights"));
const AttributionTracking = React.lazy(() => import("./pages/AttributionTracking"));
const ControlPanel = React.lazy(() => import("./pages/ControlPanel"));
const PersonaValidationPage = React.lazy(() => import("./pages/PersonaValidation"));
const Admin = React.lazy(() => import("./pages/Admin"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-persona"
                element={
                  <ProtectedRoute>
                    <CreatePersona />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/persona/:id"
                element={
                  <ProtectedRoute>
                    <PersonaProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/persona/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditPersona />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/campaign/:campaignId"
                element={
                  <ProtectedRoute>
                    <CampaignPlan />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/campaigns"
                element={
                  <ProtectedRoute>
                    <Campaigns />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/performance"
                element={
                  <ProtectedRoute>
                    <Performance />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/insights"
                element={
                  <ProtectedRoute>
                    <Insights />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/attribution"
                element={
                  <ProtectedRoute>
                    <AttributionTracking />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/control-panel"
                element={
                  <ProtectedRoute>
                    <ControlPanel />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/persona/validate/:personaId"
                element={
                  <ProtectedRoute>
                    <PersonaValidationPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
