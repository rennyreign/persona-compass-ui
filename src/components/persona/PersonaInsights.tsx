import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Lightbulb, TrendingUp, AlertTriangle, Sparkles } from "lucide-react";
import { Insight } from "@/types/persona";

interface PersonaInsightsProps {
  personaId: string;
  insights: Insight[];
}

export function PersonaInsights({ personaId, insights }: PersonaInsightsProps) {
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleGenerateInsight = async () => {
    setIsGenerating(true);
    // Simulate AI insight generation
    setTimeout(() => {
      setIsGenerating(false);
      // Here you would typically call an API to generate new insights
      console.log('Generate new insights for persona:', personaId);
    }, 2000);
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

  return (
    <div className="space-y-6">
      {/* Generate Insights Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-primary" />
                <span>AI Insights Generator</span>
              </CardTitle>
              <CardDescription>
                Generate personalized marketing insights using AI analysis
              </CardDescription>
            </div>
            <Button 
              onClick={handleGenerateInsight}
              disabled={isGenerating}
              className="flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Generating...' : 'Generate Insights'}</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>AI Analysis Ready</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Performance Data Available</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span>Behavioral Patterns Detected</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{insights.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Optimizations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {insights.filter(i => i.type === 'optimization').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {insights.filter(i => i.type === 'opportunity').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Warnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {insights.filter(i => i.type === 'warning').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Recent Insights</h3>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              AI Generated
            </Badge>
            <Badge variant="outline" className="text-xs">
              {insights.length} Total
            </Badge>
          </div>
        </div>

        {insights.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No insights yet</h3>
              <p className="text-muted-foreground mb-4">
                Generate AI-powered insights to understand this persona better and optimize your marketing strategy.
              </p>
              <Button onClick={handleGenerateInsight} disabled={isGenerating}>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate First Insight
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {insights.map((insight) => (
              <Card 
                key={insight.id} 
                className={`border-l-4 ${getInsightColor(insight.type)}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getInsightIcon(insight.type)}
                      <div className="flex-1">
                        <CardTitle className="text-base text-foreground">
                          {insight.title}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {formatDate(insight.generated_at)}
                        </CardDescription>
                      </div>
                    </div>
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
                      {insight.is_gpt_generated && (
                        <Badge variant="secondary" className="text-xs">
                          AI
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground leading-relaxed">
                    {insight.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}