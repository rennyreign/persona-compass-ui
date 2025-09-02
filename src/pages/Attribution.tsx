import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Users, Target, DollarSign, GraduationCap, Brain, BarChart3, Lightbulb } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import { ORDAEAttributionAnalyzer } from "@/components/attribution/ORDAEAttributionAnalyzer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface AttributionAnalysis {
  id: string;
  timestamp: string;
  overallScore: number;
  touchpointAnalysis: TouchpointInsight[];
  journeyOptimizations: JourneyOptimization[];
  crossChannelInsights: CrossChannelInsight[];
  attributionModels: AttributionModelComparison[];
  recommendations: AttributionRecommendation[];
}

interface TouchpointInsight {
  id: string;
  touchpoint: string;
  channel: string;
  influence: number;
  conversionContribution: number;
  dropoffRate: number;
  optimization: string;
}

interface JourneyOptimization {
  id: string;
  journeyType: string;
  currentConversion: number;
  optimizedConversion: number;
  bottleneck: string;
  solution: string;
  impact: 'high' | 'medium' | 'low';
}

interface CrossChannelInsight {
  id: string;
  channelCombination: string[];
  synergy: number;
  incrementalLift: number;
  recommendedBudgetSplit: { [key: string]: number };
}

interface AttributionModelComparison {
  id: string;
  model: string;
  accuracy: number;
  revenueAttribution: number;
  recommendedUse: string;
}

interface AttributionRecommendation {
  id: string;
  type: 'touchpoint' | 'journey' | 'budget' | 'timing';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  expectedImpact: string;
  confidence: number;
}

interface PersonaAttribution {
  id: string;
  name: string;
  program_category: string;
  conversion_rate: number;
  cost_per_acquisition: number;
  total_enrollments: number;
  revenue_attribution: number;
  trend: 'up' | 'down' | 'stable';
}

export default function Attribution() {
  const [personas, setPersonas] = useState<PersonaAttribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<AttributionAnalysis | null>(null);
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const { user } = useAuth();

  const handleAnalysisComplete = (newAnalysis: AttributionAnalysis) => {
    setAnalysis(newAnalysis);
    setShowAnalyzer(false);
  };

  useEffect(() => {
    const fetchAttributionData = async () => {
      if (!user) return;

      try {
        const { data: personasData } = await supabase
          .from('personas')
          .select('id, name, program_category')
          .eq('status', 'active');

        // Generate mock attribution data based on real personas
        const attributionData: PersonaAttribution[] = (personasData || []).map((persona, index) => ({
          id: persona.id,
          name: persona.name,
          program_category: persona.program_category || 'General',
          conversion_rate: Math.floor(Math.random() * 30) + 60, // 60-90%
          cost_per_acquisition: Math.floor(Math.random() * 100) + 80, // $80-180
          total_enrollments: Math.floor(Math.random() * 50) + 10, // 10-60
          revenue_attribution: Math.floor(Math.random() * 100000) + 50000, // $50k-150k
          trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable'
        }));

        setPersonas(attributionData);
      } catch (error) {
        console.error('Error fetching attribution data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttributionData();
  }, [user]);

  const totalRevenue = personas.reduce((sum, p) => sum + p.revenue_attribution, 0);
  const avgConversionRate = personas.length > 0 
    ? personas.reduce((sum, p) => sum + p.conversion_rate, 0) / personas.length 
    : 0;
  const totalEnrollments = personas.reduce((sum, p) => sum + p.total_enrollments, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <TopHeader />
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-foreground mb-6">Attribution Dashboard</h1>
              <div className="text-center py-8">Loading attribution data...</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopHeader />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Attribution Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                  {analysis 
                    ? `Advanced multi-touch attribution analysis (Score: ${analysis.overallScore}/100)`
                    : "Multi-touch attribution and customer journey analysis"
                  }
                </p>
              </div>
              <Button 
                className="flex items-center space-x-2"
                onClick={() => setShowAnalyzer(!showAnalyzer)}
              >
                <Brain className="w-4 h-4" />
                <span>{showAnalyzer ? 'Hide Analyzer' : 'ORDAE Analysis'}</span>
              </Button>
            </div>

            {/* ORDAE Attribution Analyzer */}
            {showAnalyzer && (
              <ORDAEAttributionAnalyzer onAnalysisComplete={handleAnalysisComplete} />
            )}

            {/* AI Analysis Summary */}
            {analysis && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-blue-500 bg-blue-50/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      Best Attribution Model
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {analysis.attributionModels.find(m => m.accuracy === Math.max(...analysis.attributionModels.map(m => m.accuracy)))?.model}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {Math.max(...analysis.attributionModels.map(m => m.accuracy))}% accuracy
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      ${Math.max(...analysis.attributionModels.map(m => m.revenueAttribution)).toLocaleString()} attributed
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500 bg-green-50/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="w-5 h-5 text-green-600" />
                      Journey Optimization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      +{Math.max(...analysis.journeyOptimizations.map(j => j.optimizedConversion - j.currentConversion)).toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Max conversion uplift
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      {analysis.journeyOptimizations.filter(j => j.impact === 'high').length} high-impact opportunities
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500 bg-purple-50/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-purple-600" />
                      Channel Synergy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600 mb-2">
                      {Math.max(...analysis.crossChannelInsights.map(c => c.synergy))}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Best channel combination
                    </div>
                    <div className="text-xs text-purple-600 mt-1">
                      +{Math.max(...analysis.crossChannelInsights.map(c => c.incrementalLift))}% incremental lift
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
        
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Attributed to personas</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Conversion</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgConversionRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Across all personas</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEnrollments}</div>
              <p className="text-xs text-muted-foreground">This quarter</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Personas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{personas.length}</div>
              <p className="text-xs text-muted-foreground">Generating results</p>
            </CardContent>
          </Card>
        </div>

        {/* Persona Attribution Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {personas.map((persona) => (
            <Card key={persona.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg truncate">{persona.name}</CardTitle>
                  {persona.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                  {persona.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
                </div>
                <Badge variant="secondary">{persona.program_category}</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Conversion Rate</span>
                    <span className="font-medium">{persona.conversion_rate}%</span>
                  </div>
                  <Progress value={persona.conversion_rate} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">CPA</p>
                    <p className="font-semibold">${persona.cost_per_acquisition}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Enrollments</p>
                    <p className="font-semibold">{persona.total_enrollments}</p>
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">Revenue Attribution</p>
                  <p className="text-xl font-bold text-green-600">
                    ${persona.revenue_attribution.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {personas.length === 0 && (
          <Card className="text-center py-8">
            <CardContent>
              <p className="text-muted-foreground">No persona attribution data available.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Create personas and run campaigns to see attribution metrics.
              </p>
            </CardContent>
          </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}