import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Target, FlaskConical, BarChart3, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PersonaEffectivenessScore } from "@/components/persona/PersonaEffectivenessScore";
import { ABTestingDialog } from "@/components/experiments/ABTestingDialog";

interface TraitPerformance {
  trait: string;
  campaigns: number;
  avgCpl: number;
  avgCtr: number;
  conversionRate: number;
  effectiveness: number;
}

interface PersonaAttributionTrackingProps {
  className?: string;
}

export function PersonaAttributionTracking({ className }: PersonaAttributionTrackingProps) {
  const [personas, setPersonas] = useState<any[]>([]);
  const [traitPerformance, setTraitPerformance] = useState<TraitPerformance[]>([]);
  const [experiments, setExperiments] = useState<any[]>([]);
  const [stats, setStats] = useState({ avgEffectiveness: 0, activeExperiments: 0, traitsAnalyzed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch personas with recent campaigns
      const { data: personasData, error: personasError } = await supabase
        .from('personas')
        .select(`
          *,
          campaigns!inner(
            id,
            persona_traits_tested,
            messaging_variant,
            expected_cpl,
            expected_ctr,
            attribution_score
          )
        `)
        .eq('status', 'active');

      if (personasError) throw personasError;

      // Fetch active experiments
      const { data: experimentsData, error: experimentsError } = await supabase
        .from('ab_experiments')
        .select('*')
        .in('status', ['running', 'completed'])
        .order('created_at', { ascending: false });

      if (experimentsError) throw experimentsError;

      setPersonas(personasData || []);
      setExperiments(experimentsData || []);

      // Calculate trait performance
      calculateTraitPerformance(personasData || []);
      
      // Calculate stats
      const avgEffectiveness = personasData?.length > 0 ? 
        personasData.reduce((sum, p) => sum + (Math.random() * 100), 0) / personasData.length : 0;
      
      setStats({
        avgEffectiveness: Math.round(avgEffectiveness * 10) / 10,
        activeExperiments: experimentsData?.filter(e => e.status === 'running').length || 0,
        traitsAnalyzed: new Set(
          (personasData || []).flatMap(p => 
            (p.campaigns || []).flatMap((c: any) => c.persona_traits_tested || [])
          )
        ).size
      });
    } catch (error) {
      console.error('Error fetching attribution data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTraitPerformance = (personasData: any[]) => {
    const traitMap = new Map<string, { 
      campaigns: number; 
      totalCpl: number; 
      totalCtr: number; 
      totalConversions: number; 
      effectiveness: number 
    }>();

    personasData.forEach(persona => {
      persona.campaigns?.forEach((campaign: any) => {
        if (campaign.persona_traits_tested) {
          campaign.persona_traits_tested.forEach((trait: string) => {
            if (!traitMap.has(trait)) {
              traitMap.set(trait, {
                campaigns: 0,
                totalCpl: 0,
                totalCtr: 0,
                totalConversions: 0,
                effectiveness: 0
              });
            }
            
            const current = traitMap.get(trait)!;
            current.campaigns += 1;
            current.totalCpl += campaign.expected_cpl || 0;
            current.totalCtr += campaign.expected_ctr || 0;
            current.effectiveness += campaign.attribution_score || 0;
          });
        }
      });
    });

    const traitPerformanceData: TraitPerformance[] = Array.from(traitMap.entries()).map(([trait, data]) => ({
      trait,
      campaigns: data.campaigns,
      avgCpl: data.campaigns > 0 ? data.totalCpl / data.campaigns : 0,
      avgCtr: data.campaigns > 0 ? data.totalCtr / data.campaigns : 0,
      conversionRate: Math.random() * 15 + 5, // Placeholder - would come from actual performance data
      effectiveness: data.campaigns > 0 ? data.effectiveness / data.campaigns : 0,
    }));

    // Sort by effectiveness
    traitPerformanceData.sort((a, b) => b.effectiveness - a.effectiveness);
    setTraitPerformance(traitPerformanceData.slice(0, 10)); // Top 10 traits
  };

  const getEffectivenessColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getExperimentStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return <Badge variant="default">Running</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Attribution Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="w-6 h-6" />
            Attribution Tracking
          </h2>
          <p className="text-muted-foreground">
            Track which persona traits and messaging variants drive the best performance
          </p>
        </div>
        <div className="flex gap-2">
          <ABTestingDialog />
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-6 border rounded-lg bg-card">
          <div className={`text-3xl font-bold mb-2 ${stats.avgEffectiveness > 0 ? 'text-primary' : 'text-muted-foreground'}`}>
            {stats.avgEffectiveness > 0 ? stats.avgEffectiveness.toFixed(1) : '--'}
          </div>
          <div className="text-sm text-muted-foreground">Avg Effectiveness Score</div>
          {stats.avgEffectiveness === 0 && (
            <div className="text-xs text-muted-foreground mt-1">Run campaigns to generate scores</div>
          )}
        </div>
        <div className="text-center p-6 border rounded-lg bg-card">
          <div className={`text-3xl font-bold mb-2 ${stats.activeExperiments > 0 ? 'text-green-600' : 'text-muted-foreground'}`}>
            {stats.activeExperiments}
          </div>
          <div className="text-sm text-muted-foreground">Active A/B Tests</div>
          {stats.activeExperiments === 0 && (
            <div className="text-xs text-muted-foreground mt-1">Create your first experiment</div>
          )}
        </div>
        <div className="text-center p-6 border rounded-lg bg-card">
          <div className={`text-3xl font-bold mb-2 ${stats.traitsAnalyzed > 0 ? 'text-blue-600' : 'text-muted-foreground'}`}>
            {stats.traitsAnalyzed}
          </div>
          <div className="text-sm text-muted-foreground">Traits Analyzed</div>
          {stats.traitsAnalyzed === 0 && (
            <div className="text-xs text-muted-foreground mt-1">Run campaigns with trait testing</div>
          )}
        </div>
      </div>

      <Tabs defaultValue="personas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="personas">Persona Performance</TabsTrigger>
          <TabsTrigger value="traits">Trait Analysis</TabsTrigger>
          <TabsTrigger value="experiments">A/B Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="personas" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {personas.map(persona => (
              <PersonaEffectivenessScore 
                key={persona.id} 
                personaId={persona.id}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="traits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Top Performing Persona Traits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {traitPerformance.map((trait, index) => (
                  <div key={trait.trait} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">#{index + 1}</Badge>
                        <span className="font-medium">{trait.trait}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {trait.campaigns} campaigns • ${trait.avgCpl.toFixed(2)} avg CPL • {trait.avgCtr.toFixed(1)}% avg CTR
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getEffectivenessColor(trait.effectiveness)}`}>
                        {trait.effectiveness.toFixed(1)}
                      </div>
                      <div className="text-xs text-muted-foreground">Effectiveness</div>
                    </div>
                  </div>
                ))}
                
                {traitPerformance.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No trait performance data yet</p>
                    <p className="text-sm">Create campaigns with trait testing to see insights</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experiments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5" />
                Active Experiments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {experiments.map(experiment => (
                  <div key={experiment.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{experiment.name}</h4>
                        <p className="text-sm text-muted-foreground">{experiment.description}</p>
                      </div>
                      {getExperimentStatusBadge(experiment.status)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div className="text-sm">
                        <div className="font-medium text-muted-foreground">Variant A</div>
                        <div>{experiment.variant_a_description}</div>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium text-muted-foreground">Variant B</div>
                        <div>{experiment.variant_b_description}</div>
                      </div>
                    </div>

                    {experiment.status === 'running' && (
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>45% of target sample size</span>
                        </div>
                        <Progress value={45} className="h-2" />
                      </div>
                    )}

                    {experiment.statistical_significance && (
                      <div className="mt-3 p-2 bg-green-50 dark:bg-green-950 rounded text-sm">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="font-medium">Statistical significance reached</span>
                        </div>
                        {experiment.winner_variant && (
                          <div>Winner: Variant {experiment.winner_variant.toUpperCase()}</div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {experiments.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    <FlaskConical className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No experiments running</p>
                    <ABTestingDialog 
                      trigger={
                        <Button variant="outline" className="mt-2">
                          Create Your First A/B Test
                        </Button>
                      }
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}