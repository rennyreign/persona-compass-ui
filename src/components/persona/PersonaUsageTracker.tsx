import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Megaphone,
  Calendar,
  BarChart3
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Persona } from '@/types/persona';
import { useNavigate } from 'react-router-dom';

interface PersonaUsage {
  persona: Persona;
  campaignCount: number;
  lastUsed: string | null;
  avgPerformance: number;
  status: 'overused' | 'underused' | 'optimal' | 'unused';
}

interface PersonaUsageTrackerProps {
  className?: string;
}

export function PersonaUsageTracker({ className }: PersonaUsageTrackerProps) {
  const [personaUsage, setPersonaUsage] = useState<PersonaUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPersonas: 0,
    activePersonas: 0,
    unusedPersonas: 0,
    underusedPersonas: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchPersonaUsageData();
  }, []);

  const fetchPersonaUsageData = async () => {
    try {
      // Fetch personas with campaign counts
      const { data: personas, error: personasError } = await supabase
        .from('personas')
        .select(`
          *,
          campaigns!inner(id, created_at, persona_id)
        `);

      if (personasError) throw personasError;

      // Calculate usage metrics for each persona
      const usageData: PersonaUsage[] = [];
      let activeCount = 0;
      let unusedCount = 0;
      let underusedCount = 0;

      for (const persona of personas || []) {
        const campaigns = persona.campaigns || [];
        const campaignCount = campaigns.length;
        
        // Get last used date
        const lastUsed = campaigns.length > 0 
          ? campaigns.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].created_at
          : null;

        // Calculate mock performance score (in real app, this would come from actual metrics)
        const avgPerformance = Math.random() * 100;

        // Determine status
        let status: PersonaUsage['status'];
        if (campaignCount === 0) {
          status = 'unused';
          unusedCount++;
        } else if (campaignCount < 2) {
          status = 'underused';
          underusedCount++;
        } else if (campaignCount > 10) {
          status = 'overused';
          activeCount++;
        } else {
          status = 'optimal';
          activeCount++;
        }

        usageData.push({
          persona,
          campaignCount,
          lastUsed,
          avgPerformance,
          status
        });
      }

      setPersonaUsage(usageData);
      setStats({
        totalPersonas: usageData.length,
        activePersonas: activeCount,
        unusedPersonas: unusedCount,
        underusedPersonas: underusedCount
      });

    } catch (error) {
      console.error('Error fetching persona usage data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: PersonaUsage['status']) => {
    switch (status) {
      case 'optimal': return 'bg-green-500';
      case 'underused': return 'bg-yellow-500';
      case 'overused': return 'bg-orange-500';
      case 'unused': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: PersonaUsage['status']) => {
    switch (status) {
      case 'optimal': return 'Optimal Usage';
      case 'underused': return 'Underused';
      case 'overused': return 'Overused';
      case 'unused': return 'Unused';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="h-8 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Usage Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.totalPersonas}</p>
                <p className="text-xs text-muted-foreground">Total Personas</p>
              </div>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.activePersonas}</p>
                <p className="text-xs text-muted-foreground">Active Usage</p>
              </div>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-yellow-600">{stats.underusedPersonas}</p>
                <p className="text-xs text-muted-foreground">Underused</p>
              </div>
              <BarChart3 className="h-4 w-4 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.unusedPersonas}</p>
                <p className="text-xs text-muted-foreground">Unused</p>
              </div>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Unused Personas Alert */}
      {stats.unusedPersonas > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You have {stats.unusedPersonas} unused personas. Consider creating campaigns for them or reviewing if they're still relevant.
          </AlertDescription>
        </Alert>
      )}

      {/* Persona Usage List */}
      <Card>
        <CardHeader>
          <CardTitle>Persona Usage Details</CardTitle>
          <CardDescription>
            Track how frequently each persona is being used in campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {personaUsage.map((usage) => (
              <div 
                key={usage.persona.id} 
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex-1">
                    <h4 className="font-medium">{usage.persona.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {usage.persona.program_category} • {usage.persona.age_range}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center gap-2 mb-1">
                      <Megaphone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{usage.campaignCount}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Campaigns</p>
                  </div>

                  <div className="text-center min-w-[100px]">
                    {usage.lastUsed ? (
                      <>
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {new Date(usage.lastUsed).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">Last Used</p>
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground">Never used</span>
                    )}
                  </div>

                  <div className="text-center min-w-[120px]">
                    <Badge 
                      variant="secondary" 
                      className={`${getStatusColor(usage.status)} text-white`}
                    >
                      {getStatusText(usage.status)}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {usage.status === 'unused' && (
                    <Button 
                      size="sm" 
                      onClick={() => navigate('/campaigns')}
                    >
                      Create Campaign
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => navigate(`/persona/${usage.persona.id}`)}
                  >
                    View Persona
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}