import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { supabase } from "@/integrations/supabase/client";

interface PersonaPerformanceChartsProps {
  personaId: string;
}

interface PerformanceData {
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  ctr: number;
  cpc: number;
  cpm: number;
  conversion_rate: number;
  roas: number;
}

// Mock performance data over time
const performanceData = [
  { month: 'Jan', cpl: 52, ctr: 2.8, leads: 45, spend: 2340 },
  { month: 'Feb', cpl: 48, ctr: 3.1, leads: 52, spend: 2496 },
  { month: 'Mar', cpl: 45, ctr: 3.2, leads: 61, spend: 2745 },
  { month: 'Apr', cpl: 43, ctr: 3.4, leads: 68, spend: 2924 },
  { month: 'May', cpl: 41, ctr: 3.6, leads: 72, spend: 2952 },
  { month: 'Jun', cpl: 46, ctr: 3.2, leads: 65, spend: 2990 },
];

const channelData = [
  { name: 'Instagram', value: 35, color: '#E1306C' },
  { name: 'TikTok', value: 28, color: '#000000' },
  { name: 'LinkedIn', value: 20, color: '#0077B5' },
  { name: 'Discord', value: 12, color: '#5865F2' },
  { name: 'YouTube', value: 5, color: '#FF0000' },
];

export function PersonaPerformanceCharts({ personaId }: PersonaPerformanceChartsProps) {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalSpend: 0,
    totalLeads: 0,
    avgCpl: 0,
    avgConversionRate: 0
  });

  useEffect(() => {
    const fetchPerformanceData = async () => {
      setLoading(true);
      
      // First get campaigns for this persona
      const { data: campaigns, error: campaignError } = await supabase
        .from('campaigns')
        .select('id')
        .eq('persona_id', personaId);
        
      if (campaignError || !campaigns?.length) {
        console.error('Error fetching campaigns:', campaignError);
        setLoading(false);
        return;
      }
      
      const campaignIds = campaigns.map(c => c.id);
      
      // Then get performance data for those campaigns
      const { data: perfData, error: perfError } = await supabase
        .from('campaign_performance')
        .select('*')
        .in('campaign_id', campaignIds)
        .order('date', { ascending: true });
        
      if (perfError) {
        console.error('Error fetching performance data:', perfError);
      } else {
        setPerformanceData(perfData || []);
        
        // Calculate summary metrics
        const totalSpend = perfData?.reduce((sum, p) => sum + (p.spend || 0), 0) || 0;
        const totalLeads = perfData?.reduce((sum, p) => sum + (p.conversions || 0), 0) || 0;
        const avgCpl = totalLeads > 0 ? totalSpend / totalLeads : 0;
        const avgConversionRate = perfData?.length ? 
          perfData.reduce((sum, p) => sum + (p.conversion_rate || 0), 0) / perfData.length : 0;
          
        setSummary({
          totalSpend,
          totalLeads,
          avgCpl,
          avgConversionRate
        });
      }
      
      setLoading(false);
    };

    fetchPerformanceData();
  }, [personaId]);

  // Group data by month for charts
  const monthlyData = performanceData.reduce((acc, curr) => {
    const month = new Date(curr.date).toLocaleDateString('en-US', { month: 'short' });
    const existing = acc.find(item => item.month === month);
    
    if (existing) {
      existing.spend += curr.spend || 0;
      existing.leads += curr.conversions || 0;
      existing.clicks += curr.clicks || 0;
      existing.impressions += curr.impressions || 0;
    } else {
      acc.push({
        month,
        spend: curr.spend || 0,
        leads: curr.conversions || 0,
        clicks: curr.clicks || 0,
        impressions: curr.impressions || 0,
        ctr: curr.ctr || 0,
        cpl: curr.spend && curr.conversions ? curr.spend / curr.conversions : 0
      });
    }
    
    return acc;
  }, [] as any[]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading performance data...</p>
      </div>
    );
  }

  if (performanceData.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No performance data available yet.</p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${summary.totalSpend.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">All time total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{summary.totalLeads}</div>
            <p className="text-xs text-muted-foreground mt-1">All time total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cost Per Lead</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${summary.avgCpl.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Average CPL</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{summary.avgConversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">Average rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CPL Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Cost Per Lead Trend</CardTitle>
            <CardDescription>6-month CPL performance tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                <YAxis className="text-xs fill-muted-foreground" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="cpl" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* CTR Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Click-Through Rate</CardTitle>
            <CardDescription>6-month CTR performance tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                <YAxis className="text-xs fill-muted-foreground" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="ctr" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary) / 0.2)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Leads Generated */}
        <Card>
          <CardHeader>
            <CardTitle>Leads Generated</CardTitle>
            <CardDescription>Monthly lead generation performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                <YAxis className="text-xs fill-muted-foreground" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="leads" 
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Channel Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Channel Performance</CardTitle>
            <CardDescription>Lead distribution by channel</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                  labelLine={false}
                  className="text-xs fill-foreground"
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}