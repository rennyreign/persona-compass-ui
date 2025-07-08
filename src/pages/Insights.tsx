import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Brain, Lightbulb, TrendingUp, AlertTriangle, Sparkles, Search, Filter, Calendar } from "lucide-react";
import { mockInsights } from "@/data/mockData";

const Insights = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Sort insights by date (newest first)
  const sortedInsights = [...mockInsights].sort((a, b) => 
    new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
  );

  // Filter insights based on search and type
  const filteredInsights = sortedInsights.filter(insight => {
    const matchesSearch = insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         insight.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || insight.type === filterType;
    return matchesSearch && matchesType;
  });

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'optimization':
        return <TrendingUp className="w-5 h-5 text-blue-600" />;
      case 'opportunity':
        return <Lightbulb className="w-5 h-5 text-yellow-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'trend':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      default:
        return <Brain className="w-5 h-5 text-gray-600" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'optimization':
        return 'border-l-blue-500 bg-blue-50/50';
      case 'opportunity':
        return 'border-l-yellow-500 bg-yellow-50/50';
      case 'warning':
        return 'border-l-red-500 bg-red-50/50';
      case 'trend':
        return 'border-l-green-500 bg-green-50/50';
      default:
        return 'border-l-gray-500 bg-gray-50/50';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeCount = (type: string) => {
    return mockInsights.filter(insight => insight.type === type).length;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <a href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src="/lovable-uploads/89175e4f-021a-4be2-a013-b97ccb4af0c3.png" 
                    alt="MSU Logo" 
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">MSU Persona</div>
                  <div className="text-xs text-muted-foreground">Intelligence Platform</div>
                </div>
              </a>
              <div className="w-px h-8 bg-border"></div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">AI Insights</h1>
                <p className="text-muted-foreground mt-1">Audit trail of recent insights and recommendations</p>
              </div>
            </div>
            <Button className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Generate New Insights</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{mockInsights.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Optimizations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{getTypeCount('optimization')}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{getTypeCount('opportunity')}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Warnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{getTypeCount('warning')}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Insights Feed</CardTitle>
            <CardDescription>Search and filter through your AI-generated insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search insights..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filter by Type */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <div className="flex space-x-2">
                  {[
                    { key: 'all', label: 'All', count: mockInsights.length },
                    { key: 'optimization', label: 'Optimizations', count: getTypeCount('optimization') },
                    { key: 'opportunity', label: 'Opportunities', count: getTypeCount('opportunity') },
                    { key: 'warning', label: 'Warnings', count: getTypeCount('warning') },
                  ].map((filter) => (
                    <Button
                      key={filter.key}
                      variant={filterType === filter.key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterType(filter.key)}
                      className="text-xs"
                    >
                      {filter.label} ({filter.count})
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Insights Feed */}
            <div className="space-y-4">
              {filteredInsights.length === 0 ? (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No insights found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || filterType !== 'all' 
                      ? 'Try adjusting your search or filters.' 
                      : 'Generate your first AI insight to get started.'
                    }
                  </p>
                </div>
              ) : (
                filteredInsights.map((insight) => (
                  <Card 
                    key={insight.id} 
                    className={`border-l-4 ${getInsightColor(insight.type)} hover:shadow-md transition-shadow`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between space-x-4">
                        <div className="flex items-start space-x-4 flex-1">
                          {getInsightIcon(insight.type)}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold text-foreground">
                                {insight.title}
                              </h3>
                              <div className="flex items-center space-x-2">
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${
                                    insight.type === 'optimization' ? 'text-blue-600 border-blue-200' :
                                    insight.type === 'opportunity' ? 'text-yellow-600 border-yellow-200' :
                                    insight.type === 'warning' ? 'text-red-600 border-red-200' :
                                    'text-green-600 border-green-200'
                                  }`}
                                >
                                  {insight.type}
                                </Badge>
                                {insight.isGptGenerated && (
                                  <Badge variant="secondary" className="text-xs">
                                    AI Generated
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <p className="text-foreground leading-relaxed">
                              {insight.content}
                            </p>
                            
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(insight.generatedAt)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span className="w-2 h-2 bg-primary rounded-full"></span>
                                <span>Persona: {insight.personaId}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Load More */}
            {filteredInsights.length > 0 && (
              <div className="text-center pt-6">
                <Button variant="outline">
                  Load More Insights
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Insights;