import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ProgramManagementTable } from '@/components/admin/ProgramManagementTable';
import { PersonaManagementTable } from '@/components/admin/PersonaManagementTable';
import { StickyCampaignCreator } from '@/components/admin/StickyCampaignCreator';
import { Settings, Building, AlertCircle, Shield, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Organization, Persona } from "@/types/persona";

export default function Admin() {
  const [selectedOrganization, setSelectedOrganization] = useState<string>('');
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBootstrap, setShowBootstrap] = useState(false);
  const [selectedPersonas, setSelectedPersonas] = useState<Persona[]>([]);
  const { user } = useAuth();

  // Bootstrap admin access
  const bootstrapAdminAccess = async () => {
    if (!user) return;
    
    try {
      // First, ensure an organization exists
      const { data: existingOrgs } = await supabase
        .from('organizations')
        .select('id, name')
        .limit(1);
      
      let orgId = existingOrgs?.[0]?.id;
      
      if (!orgId) {
        // Create a default organization
        const { data: newOrg, error: orgError } = await supabase
          .from('organizations')
          .insert({
            name: 'Michigan State University',
            subdomain: 'msu'
          })
          .select('id')
          .single();
        
        if (orgError) throw orgError;
        orgId = newOrg.id;
      }
      
      // Create admin role for current user
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: user.id,
          organization_id: orgId,
          role: 'bisk_admin'
        });
      
      if (roleError) throw roleError;
      
      // Refresh the page data
      fetchData();
      setShowBootstrap(false);
    } catch (err) {
      console.error('Bootstrap error:', err);
      setError('Failed to bootstrap admin access');
    }
  };

  // Fetch user role and organizations
  const fetchData = async () => {
    if (!user) return;
    
    try {
      setError(null);
      
      // Get user role
      const { data: roleData, error: roleError } = await supabase.rpc('get_user_organization_role');
      
      if (roleError) {
        console.error('RPC error:', roleError);
        setShowBootstrap(true);
        setLoading(false);
        return;
      }
      
      if (roleData && roleData.length > 0) {
        setUserRole(roleData[0].role);
        
        // Fetch organizations if user is bisk_admin
        if (roleData[0].role === 'bisk_admin') {
          const { data: orgsData } = await supabase
            .from('organizations')
            .select('id, name, subdomain')
            .order('name');
          if (orgsData) {
            setOrganizations(orgsData);
            // Auto-select first organization if available
            if (orgsData.length > 0 && !selectedOrganization) {
              setSelectedOrganization(orgsData[0].id);
            }
          }
        }
      } else {
        // No role found, show bootstrap option
        setShowBootstrap(true);
      }
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load admin data');
      setShowBootstrap(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Loading admin tools...</div>
        </div>
      </div>
    );
  }

  if (showBootstrap) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Admin Setup Required</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                No admin role found for your account. Click below to bootstrap admin access.
              </p>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button onClick={bootstrapAdminAccess} className="w-full">
                Bootstrap Admin Access
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (userRole !== 'bisk_admin') {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <Alert className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Access denied. Admin privileges required.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const AdminComponentWrapper = ({ children, title }: { children: React.ReactNode, title: string }) => {
    try {
      return <>{children}</>;
    } catch (error) {
      console.error(`Error in ${title}:`, error);
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading {title}. Please refresh the page.
          </AlertDescription>
        </Alert>
      );
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />
        
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <div className="border-b border-border bg-card">
            <div className="max-w-7xl mx-auto px-6 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Settings className="w-8 h-8 text-primary" />
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">Admin Tools</h1>
                    <p className="text-muted-foreground">Bulk operations and administrative functions</p>
                  </div>
                </div>
                
                {/* University Selector */}
                <div className="flex items-center space-x-3">
                  <Building className="w-5 h-5 text-muted-foreground" />
                  <Select value={selectedOrganization} onValueChange={setSelectedOrganization}>
                    <SelectTrigger className="w-64 bg-white border-border text-foreground">
                      <SelectValue placeholder="Select University" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizations.map((org) => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {!selectedOrganization && (
                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please select a university to enable admin tools.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full px-6 py-8 pb-24">
            {selectedOrganization ? (
              <div className="space-y-8">
                
                {/* Step 1: Program Management - Inputs */}
                <div className="relative">
                  <div className="absolute -left-8 top-6 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                    1
                  </div>
                  <ProgramManagementTable selectedOrganization={selectedOrganization} />
                </div>

                {/* Flow Arrow */}
                <div className="flex items-center justify-center py-4">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-12 h-px bg-border"></div>
                    <ArrowRight className="h-5 w-5" />
                    <div className="w-12 h-px bg-border"></div>
                  </div>
                </div>

                {/* Step 2: Persona Management - Outputs */}
                <div className="relative">
                  <div className="absolute -left-8 top-6 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                    2
                  </div>
                  <PersonaManagementTable onSelectionChange={setSelectedPersonas} />
                </div>

                {/* Flow Arrow */}
                <div className="flex items-center justify-center py-4">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-12 h-px bg-border"></div>
                    <ArrowRight className="h-5 w-5" />
                    <div className="w-12 h-px bg-border"></div>
                  </div>
                </div>

                {/* Step 3: Campaign Creation - Actions */}
                <div className="relative">
                  <div className="absolute -left-8 top-6 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                    3
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-primary" />
                        Campaign Creation
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Select personas above to create targeted campaigns
                      </p>
                    </CardHeader>
                    <CardContent>
                      {selectedPersonas.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <Settings className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <h3 className="text-lg font-semibold mb-2">Ready for Campaign Creation</h3>
                          <p className="text-muted-foreground">
                            Select personas from the table above to begin creating targeted campaigns.
                          </p>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Settings className="h-8 w-8 text-primary" />
                          </div>
                          <h3 className="text-lg font-semibold mb-2">Campaign Actions Available</h3>
                          <p className="text-muted-foreground mb-4">
                            Use the sticky footer below to create campaigns with your selected personas.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

              </div>
            ) : (
              <div className="flex items-center justify-center py-16">
                <div className="text-center space-y-4">
                  <Building className="w-16 h-16 text-muted-foreground mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Select University</h3>
                    <p className="text-muted-foreground">Choose a university from the dropdown above to access admin tools.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Campaign Creator */}
          <StickyCampaignCreator 
            selectedPersonas={selectedPersonas}
            onClearSelection={() => setSelectedPersonas([])}
          />
        </div>
      </div>
    </div>
  );
}
