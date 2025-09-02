import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Users, DollarSign, Target, MousePointer, Brain, AlertTriangle, Lightbulb } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import { ORDAEPerformanceMonitor } from "@/components/performance/ORDAEPerformanceMonitor";
// Mock data removed - using database-driven personas
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

interface PerformanceAnalysis {
  id: string;
  timestamp: string;
  overallScore: number;
  recommendations: PerformanceRecommendation[];
  alerts: PerformanceAlert[];
  predictions: PerformancePrediction[];
  optimizations: PerformanceOptimization[];
}

interface PerformanceRecommendation {
  id: string;
  type: 'budget' | 'targeting' | 'creative' | 'timing';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  expectedImpact: string;
  confidence: number;
}

interface PerformanceAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  affectedPersonas: string[];
  actionRequired: boolean;
}

interface PerformancePrediction {
  id: string;
  metric: string;
  currentValue: number;
  predictedValue: number;
  timeframe: string;
  confidence: number;
}

interface PerformanceOptimization {
  id: string;
  category: string;
  title: string;
  description: string;
  potentialSavings: number;
  implementationEffort: 'low' | 'medium' | 'high';
}

const Performance = () => {
  const [analysis, setAnalysis] = useState<PerformanceAnalysis | null>(null);
  const [showMonitor, setShowMonitor] = useState(false);

  // Placeholder metrics - will be calculated from database personas
  const totalPersonas = 0;
  const totalActivePersonas = 0;
  const globalCPL = 0;
  const globalCTR = 0;
  const totalLeads = 0;
  const totalSpend = 0;

  const handleAnalysisComplete = (newAnalysis: PerformanceAnalysis) => {
    setAnalysis(newAnalysis);
    setShowMonitor(false);
  };

  // Mock performance data over time
  const performanceData = [
    { month: 'Jan', cpl: 45, ctr: 2.1, leads: 120, spend: 5400 },
    { month: 'Feb', cpl: 42, ctr: 2.3, leads: 135, spend: 5670 },
    { month: 'Mar', cpl: 38, ctr: 2.6, leads: 156, spend: 5928 },
    { month: 'Apr', cpl: 41, ctr: 2.4, leads: 148, spend: 6068 },
    { month: 'May', cpl: 39, ctr: 2.7, leads: 162, spend: 6318 },
    { month: 'Jun', cpl: 37, ctr: 2.8, leads: 175, spend: 6475 },
  ];

  // Channel performance data
  const channelData = [
    { name: 'Facebook', leads: 35, spend: 2500, color: '#4267B2' },
    { name: 'Google', leads: 28, spend: 2200, color: '#34A853' },
    { name: 'Instagram', leads: 22, spend: 1800, color: '#E4405F' },
    { name: 'LinkedIn', leads: 15, spend: 1500, color: '#0077B5' },
  ];

  // Program performance breakdown - placeholder data
  const programData = [
    { name: 'Business Administration', cpl: 72.80, leads: 222, ctr: 3.1 },
    { name: 'Healthcare', cpl: 78.25, leads: 199, ctr: 2.8 },
    { name: 'Data Analytics', cpl: 67.25, leads: 216, ctr: 2.8 }
  ].map(program => ({
    name: program.name,
    cpl: program.cpl,
    leads: program.leads,
    ctr: program.ctr,
  }));

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <TopHeader />
        
        {/* Performance Dashboard Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Performance Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                  {analysis 
                    ? `Real-time metrics with AI analysis (Score: ${analysis.overallScore}/100)`
                    : "Global blended metrics across all personas"
                  }
                </p>
              </div>
              <Button 
                className="flex items-center space-x-2"
                onClick={() => setShowMonitor(!showMonitor)}
              >
                <Brain className="w-4 h-4" />
                <span>{showMonitor ? 'Hide Monitor' : 'ORDAE Analysis'}</span>
              </Button>
            </div>

            {/* ORDAE Performance Monitor */}
            {showMonitor && (
              <ORDAEPerformanceMonitor onAnalysisComplete={handleAnalysisComplete} />
            )}

            {/* AI Analysis Summary */}
            {analysis && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-red-500 bg-red-50/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      Critical Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600 mb-2">
                      {analysis.alerts.filter(a => a.severity === 'critical').length}
                    </div>
                    {analysis.alerts.filter(a => a.severity === 'critical').slice(0, 1).map(alert => (
                      <div key={alert.id} className="space-y-2">
                        <p className="text-sm font-medium">{alert.title}</p>
                        <p className="text-xs text-muted-foreground">{alert.description}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500 bg-blue-50/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-blue-600" />
                      Top Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {analysis.recommendations.filter(r => r.priority === 'high').length}
                    </div>
                    {analysis.recommendations.slice(0, 1).map(rec => (
                      <div key={rec.id} className="space-y-2">
                        <p className="text-sm font-medium">{rec.title}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {rec.confidence}% confidence
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {rec.expectedImpact}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500 bg-green-50/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      Potential Savings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      ${analysis.optimizations.reduce((sum, o) => sum + o.potentialSavings, 0).toLocaleString()}
                    </div>
                    {analysis.optimizations.slice(0, 1).map(opt => (
                      <div key={opt.id} className="space-y-2">
                        <p className="text-sm font-medium">{opt.title}</p>
                        <Badge variant="outline" className="text-xs">
                          {opt.implementationEffort} effort
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Global CPL</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${globalCPL.toFixed(2)}</div>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <TrendingDown className="h-3 w-3 text-green-500" />
                    <span className="text-green-500">8.2% lower</span>
                    <span>vs last month</span>
                  </div>
                  {analysis && analysis.predictions.find(p => p.metric === 'Global CPL') && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                      <div className="flex items-center gap-1">
                        <Brain className="w-3 h-3 text-blue-600" />
                        <span className="text-blue-600 font-medium">AI Prediction:</span>
                      </div>
                      <div className="text-blue-700">
                        ${analysis.predictions.find(p => p.metric === 'Global CPL')?.predictedValue.toFixed(2)} in 30 days
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Global CTR</CardTitle>
                  <MousePointer className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{globalCTR.toFixed(1)}%</div>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-green-500">12.3% higher</span>
                    <span>vs last month</span>
                  </div>
                  {analysis && analysis.predictions.find(p => p.metric === 'Global CTR') && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                      <div className="flex items-center gap-1">
                        <Brain className="w-3 h-3 text-blue-600" />
                        <span className="text-blue-600 font-medium">AI Prediction:</span>
                      </div>
                      <div className="text-blue-700">
                        {analysis.predictions.find(p => p.metric === 'Global CTR')?.predictedValue.toFixed(1)}% in 30 days
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalLeads.toLocaleString()}</div>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-green-500">15.4% increase</span>
                    <span>vs last month</span>
                  </div>
                  {analysis && analysis.predictions.find(p => p.metric === 'Total Leads') && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                      <div className="flex items-center gap-1">
                        <Brain className="w-3 h-3 text-blue-600" />
                        <span className="text-blue-600 font-medium">AI Prediction:</span>
                      </div>
                      <div className="text-blue-700">
                        {analysis.predictions.find(p => p.metric === 'Total Leads')?.predictedValue.toLocaleString()} in 30 days
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalSpend.toLocaleString()}</div>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 text-orange-500" />
                    <span className="text-orange-500">5.2% increase</span>
                    <span>vs last month</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* CPL Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Cost Per Lead Trend</CardTitle>
                  <CardDescription>Monthly CPL performance across all personas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value}`, 'CPL']} />
                        <Line type="monotone" dataKey="cpl" stroke="hsl(var(--primary))" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* CTR Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Click-Through Rate Trend</CardTitle>
                  <CardDescription>Monthly CTR performance across all personas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value}%`, 'CTR']} />
                        <Line type="monotone" dataKey="ctr" stroke="hsl(var(--primary))" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Program Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Performance by Program</CardTitle>
                <CardDescription>Breakdown of key metrics by academic program</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={programData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="leads" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Channel Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Channel Performance</CardTitle>
                  <CardDescription>Lead generation by marketing channel</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={channelData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="leads"
                          label={(entry) => entry.name}
                        >
                          {channelData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Personas</CardTitle>
                  <CardDescription>Performance summary of all personas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Personas</span>
                    <Badge variant="secondary">{totalPersonas}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Personas</span>
                    <Badge variant="secondary">{totalActivePersonas}</Badge>
                  </div>
                  <div className="space-y-3">
                    {totalPersonas === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">No personas available</p>
                        <p className="text-xs">Create personas to see performance data</p>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        <p className="text-sm">Persona performance data will be displayed here</p>
                        <p className="text-xs">Connect to database to load real persona metrics</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Performance;