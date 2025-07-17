import { useState, useMemo, useEffect } from "react";
import { Users, FileText, DollarSign, GraduationCap, Plus, Building } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KPICard } from "./KPICard";
import { PersonaFilterTabs } from "./PersonaFilterTabs";
import { PersonaGrid } from "./PersonaGrid";
import { CreateUniversityDialog } from "./CreateUniversityDialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Persona, Organization } from "@/types/persona";

interface DashboardProps {
  className?: string;
}

export function Dashboard({ className }: DashboardProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrganization, setSelectedOrganization] = useState<string>('all');
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateUniversity, setShowCreateUniversity] = useState(false);
  const { user } = useAuth();

  // Fetch user role and organizations
  useEffect(() => {
    const fetchUserRole = async () => {
      console.log('Current user:', user);
      if (!user) {
        console.log('No user found, skipping role fetch');
        return;
      }
      
      const { data } = await supabase.rpc('get_user_organization_role');
      if (data && data.length > 0) {
        setUserRole(data[0].role);
      }

      // Fetch organizations if user is bisk_admin
      if (data && data.length > 0 && data[0].role === 'bisk_admin') {
        const { data: orgsData } = await supabase
          .from('organizations')
          .select('id, name, subdomain')
          .order('name');
        if (orgsData) {
          setOrganizations(orgsData);
        }
      }
    };

    fetchUserRole();
  }, [user]);

  // Fetch personas
  useEffect(() => {
    const fetchPersonas = async () => {
      if (!user) {
        console.log('No user, skipping persona fetch');
        return;
      }

      console.log('Fetching personas for user:', user.id, 'Role:', userRole, 'Selected org:', selectedOrganization);
      setLoading(true);
      let query = supabase
        .from('personas')
        .select(`
          *,
          organization:organizations(id, name, subdomain)
        `);

      console.log('Building query...');
      
      // If not bisk_admin or specific organization selected, filter appropriately
      if (userRole !== 'bisk_admin') {
        console.log('User is not bisk_admin, filtering by user_id');
        query = query.eq('user_id', user.id);
      } else if (selectedOrganization !== 'all') {
        console.log('bisk_admin filtering by organization:', selectedOrganization);
        query = query.eq('organization_id', selectedOrganization);
      } else {
        console.log('bisk_admin viewing all personas');
      }

      const { data, error } = await query;
      console.log('Fetched personas:', data, 'Error:', error);
      console.log('Personas count:', data?.length || 0);
      
      if (error) {
        console.error('Error fetching personas:', error);
      } else {
        console.log('Setting personas:', data || []);
        setPersonas(data || []);
      }
      setLoading(false);
    };

    if (user && userRole !== null) {
      console.log('Triggering persona fetch - User:', !!user, 'UserRole:', userRole);
      fetchPersonas();
    } else {
      console.log('Not fetching personas - User:', !!user, 'UserRole:', userRole);
    }
  }, [user, userRole, selectedOrganization]);

  const filteredPersonas = useMemo(() => {
    let filtered = personas;
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }
    
    // Apply program category filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(p => p.program_category === activeFilter);
    }
    
    return filtered;
  }, [personas, activeFilter, statusFilter]);

  // Get unique program categories for current filtered personas
  const availablePrograms = useMemo(() => {
    const currentPersonas = selectedOrganization === 'all' 
      ? personas 
      : personas.filter(p => p.organization_id === selectedOrganization);
    
    const programs = new Set(
      currentPersonas
        .map(p => p.program_category)
        .filter(Boolean)
    );
    return Array.from(programs);
  }, [personas, selectedOrganization]);

  const handlePersonaClick = (persona: Persona) => {
    window.location.href = `/persona/${persona.id}`;
  };

  // Calculate KPIs from real data
  const kpis = useMemo(() => {
    return {
      totalPersonas: personas.length,
      avgCPL: 125.50, // Mock data for now
    };
  }, [personas]);

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
        {/* Header with Create Button */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Personas</h2>
            <p className="text-muted-foreground">Manage your marketing personas</p>
          </div>
          <div className="flex items-center gap-4">
            {/* University Filter - Only for bisk_admin */}
            {userRole === 'bisk_admin' && (
              <Select value={selectedOrganization} onValueChange={setSelectedOrganization}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select University" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Universities</SelectItem>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {/* Create University Button - Only for bisk_admin */}
            {userRole === 'bisk_admin' && (
              <Button variant="outline" onClick={() => setShowCreateUniversity(true)}>
                <Building className="w-4 h-4 mr-2" />
                Create University
              </Button>
            )}
            
            <Link to="/create-persona">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Persona
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter Tabs */}
        <PersonaFilterTabs
          personas={personas}
          availablePrograms={availablePrograms}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
        
        {/* Personas Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading personas...</div>
          </div>
        ) : (
          <PersonaGrid
            personas={filteredPersonas}
            onPersonaClick={handlePersonaClick}
          />
        )}
      </div>

      {/* Create University Dialog */}
      {showCreateUniversity && (
        <CreateUniversityDialog
          open={showCreateUniversity}
          onOpenChange={setShowCreateUniversity}
          onUniversityCreated={() => {
            // Refresh organizations list
            if (userRole === 'bisk_admin') {
              supabase
                .from('organizations')
                .select('id, name, subdomain')
                .order('name')
                .then(({ data }) => {
                  if (data) setOrganizations(data);
                });
            }
          }}
        />
      )}
    </div>
  );
}