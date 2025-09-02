import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { BulkCampaignCreator } from '@/components/admin/BulkCampaignCreator';
import { PersonaManagementDashboard } from '@/components/admin/PersonaManagementDashboard';
import { ProgramManager } from '@/components/admin/ProgramManager';
import { Settings, Users, Target, Building, AlertCircle, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Organization } from "@/types/persona";

export default function Admin() {
  const [selectedOrganization, setSelectedOrganization] = useState<string>('');
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBootstrap, setShowBootstrap] = useState(false);
  const [componentError, setComponentError] = useState<string | null>(null);
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
                    Please select a university to enable bulk creation tools.
                  </AlertDescription>
                </Alert>
              )}

              {componentError && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{componentError}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full px-6 py-8">
            {selectedOrganization ? (
              <div className="space-y-12">
                
                {/* Row 1: Program Management */}
                <div className="w-full">
                  <AdminComponentWrapper title="Program Manager">
                    <ProgramManager selectedOrganization={selectedOrganization} />
                  </AdminComponentWrapper>
                </div>

                {/* Row 2: Persona Management Dashboard */}
                <div className="w-full">
                  <AdminComponentWrapper title="Persona Management Dashboard">
                    <PersonaManagementDashboard />
                  </AdminComponentWrapper>
                </div>

                {/* Row 3: Bulk Campaign Creator */}
                <div className="w-full">
                  <div className="flex items-center space-x-3 mb-6">
                    <Target className="w-6 h-6 text-purple-600" />
                    <h2 className="text-2xl font-bold text-foreground">Bulk Campaign Creator</h2>
                  </div>
                  <AdminComponentWrapper title="Bulk Campaign Creator">
                    <BulkCampaignCreator selectedOrganization={selectedOrganization} />
                  </AdminComponentWrapper>
                </div>

              </div>
            ) : (
              <div className="flex items-center justify-center py-16">
                <div className="text-center space-y-4">
                  <Building className="w-16 h-16 text-muted-foreground mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Select University</h3>
                    <p className="text-muted-foreground">Choose a university from the dropdown above to access bulk creation tools.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
