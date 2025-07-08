import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, DollarSign, Target, MousePointer } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import { mockPersonas } from "@/data/mockData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const Performance = () => {
  // Calculate global blended metrics from all personas
  const totalPersonas = mockPersonas.length;
  const totalActivePersonas = mockPersonas.filter(p => p.isActive).length;
  const globalCPL = mockPersonas.reduce((sum, p) => sum + p.performance.cpl, 0) / totalPersonas;
  const globalCTR = mockPersonas.reduce((sum, p) => sum + p.performance.ctr, 0) / totalPersonas;
  const totalLeads = mockPersonas.reduce((sum, p) => sum + p.performance.totalLeads, 0);
  const totalSpend = mockPersonas.reduce((sum, p) => sum + p.performance.totalSpend, 0);

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

  // Program performance breakdown
  const programData = mockPersonas.map(persona => ({
    name: persona.program,
    cpl: persona.performance.cpl,
    leads: persona.performance.totalLeads,
    ctr: persona.performance.ctr,
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
            <div>
              <h1 className="text-3xl font-bold text-foreground">Performance Dashboard</h1>
              <p className="text-muted-foreground mt-2">Global blended metrics across all personas</p>
            </div>

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
                    {mockPersonas.map((persona) => (
                      <div key={persona.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                          <span className="text-sm font-medium">{persona.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            ${persona.performance.cpl} CPL
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {persona.performance.ctr}% CTR
                          </Badge>
                        </div>
                      </div>
                    ))}
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