import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Target, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PersonaEffectivenessScoreProps {
  personaId: string;
  className?: string;
}

interface EffectivenessData {
  effectiveness_score: number;
  conversion_rate: number;
  cost_efficiency: number;
  roi_score: number;
  campaign_count: number;
  total_spend: number;
  total_leads: number;
  avg_cpl: number;
  avg_ctr: number;
  date: string;
}

export function PersonaEffectivenessScore({ personaId, className }: PersonaEffectivenessScoreProps) {
  const [effectivenessData, setEffectivenessData] = useState<EffectivenessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable');

  useEffect(() => {
    fetchEffectivenessData();
  }, [personaId]);

  const fetchEffectivenessData = async () => {
    try {
      // Get the most recent effectiveness score
      const { data: currentData, error: currentError } = await supabase
        .from('persona_performance_tracking')
        .select('*')
        .eq('persona_id', personaId)
        .order('date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (currentError) {
        console.error('Error fetching current effectiveness data:', currentError);
        return;
      }

      // Get previous week's data for trend calculation
      const { data: previousData, error: previousError } = await supabase
        .from('persona_performance_tracking')
        .select('effectiveness_score')
        .eq('persona_id', personaId)
        .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('date', { ascending: false })
        .limit(2);

      if (previousError) {
        console.error('Error fetching previous effectiveness data:', previousError);
      }

      // Calculate trend
      if (previousData && previousData.length >= 2) {
        const current = previousData[0].effectiveness_score;
        const previous = previousData[1].effectiveness_score;
        const change = ((current - previous) / previous) * 100;
        
        if (change > 5) setTrend('up');
        else if (change < -5) setTrend('down');
        else setTrend('stable');
      }

      setEffectivenessData(currentData);
    } catch (error) {
      console.error('Error fetching effectiveness data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Persona Effectiveness
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-8 bg-muted rounded w-24"></div>
            <div className="h-4 bg-muted rounded w-32"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!effectivenessData) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Persona Effectiveness
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No performance data yet</p>
            <p className="text-sm">Run campaigns to generate effectiveness scores</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { label: 'Excellent', variant: 'default' as const };
    if (score >= 60) return { label: 'Good', variant: 'secondary' as const };
    if (score >= 40) return { label: 'Fair', variant: 'outline' as const };
    return { label: 'Needs Optimization', variant: 'destructive' as const };
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const scoreInfo = getScoreBadge(effectivenessData.effectiveness_score);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Persona Effectiveness
          </div>
          {getTrendIcon()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-3xl font-bold ${getScoreColor(effectivenessData.effectiveness_score)}`}>
              {effectivenessData.effectiveness_score.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">Effectiveness Score</div>
          </div>
          <Badge variant={scoreInfo.variant}>
            {scoreInfo.label}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium">{effectivenessData.campaign_count}</div>
            <div className="text-muted-foreground">Campaigns</div>
          </div>
          <div>
            <div className="font-medium">${effectivenessData.total_spend.toLocaleString()}</div>
            <div className="text-muted-foreground">Total Spend</div>
          </div>
          <div>
            <div className="font-medium">{effectivenessData.total_leads}</div>
            <div className="text-muted-foreground">Total Leads</div>
          </div>
          <div>
            <div className="font-medium">${effectivenessData.avg_cpl.toFixed(2)}</div>
            <div className="text-muted-foreground">Avg CPL</div>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="text-xs text-muted-foreground">
            Score based on campaign performance, cost efficiency, and conversion metrics
          </div>
        </div>
      </CardContent>
    </Card>
  );
}