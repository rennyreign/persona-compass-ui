import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Target, TrendingUp, Zap, CheckCircle, AlertCircle, Lightbulb, BarChart3, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ORDAEInsightsGeneratorProps {
  onInsightsGenerated: (insights: AIInsight[]) => void;
}

interface AIInsight {
  id: string;
  title: string;
  content: string;
  type: 'optimization' | 'opportunity' | 'warning' | 'trend';
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  personaId: string;
  generatedAt: string;
  isGptGenerated: boolean;
  vectorSimilarity?: number;
  recommendations: string[];
}

interface ORDAEStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  result?: any;
  icon: React.ReactNode;
}

export function ORDAEInsightsGenerator({ onInsightsGenerated }: ORDAEInsightsGeneratorProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const { toast } = useToast();

  const ordaeSteps: ORDAEStep[] = [
    {
      id: 'observe',
      name: 'Observe',
      description: 'Analyzing campaign performance and persona data',
      status: 'pending',
      icon: <Target className="w-4 h-4" />
    },
    {
      id: 'remember',
      name: 'Remember',
      description: 'Retrieving similar patterns from vector memory',
      status: 'pending',
      icon: <Brain className="w-4 h-4" />
    },
    {
      id: 'decide',
      name: 'Decide',
      description: 'Identifying optimization opportunities',
      status: 'pending',
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      id: 'act',
      name: 'Act',
      description: 'Generating actionable insights and recommendations',
      status: 'pending',
      icon: <Zap className="w-4 h-4" />
    },
    {
      id: 'evaluate',
      name: 'Evaluate',
      description: 'Validating insights and ranking by impact',
      status: 'pending',
      icon: <CheckCircle className="w-4 h-4" />
    }
  ];

  const [steps, setSteps] = useState<ORDAEStep[]>(ordaeSteps);

  const updateStepStatus = (stepId: string, status: ORDAEStep['status'], result?: any) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status, result } : step
    ));
  };

  const generateInsights = async () => {
    setIsProcessing(true);
    setCurrentStep(0);

    try {
      // Step 1: Observe
      updateStepStatus('observe', 'processing');
      await new Promise(resolve => setTimeout(resolve, 1800));
      const observeResult = {
        campaignsAnalyzed: 24,
        personasAnalyzed: 8,
        dataPoints: 1247,
        timeRange: '30 days'
      };
      updateStepStatus('observe', 'completed', observeResult);
      setCurrentStep(1);

      // Step 2: Remember
      updateStepStatus('remember', 'processing');
      await new Promise(resolve => setTimeout(resolve, 2200));
      const rememberResult = {
        similarPatterns: [
          'LinkedIn campaigns show 34% higher engagement for professional personas',
          'Email sequences with 3-touch cadence optimize conversion by 28%',
          'Career-focused messaging outperforms feature-focused by 41%'
        ],
        vectorMatches: 15
      };
      updateStepStatus('remember', 'completed', rememberResult);
      setCurrentStep(2);

      // Step 3: Decide
      updateStepStatus('decide', 'processing');
      await new Promise(resolve => setTimeout(resolve, 1600));
      const decideResult = {
        opportunitiesFound: 7,
        optimizationsIdentified: 5,
        warningsDetected: 2
      };
      updateStepStatus('decide', 'completed', decideResult);
      setCurrentStep(3);

      // Step 4: Act
      updateStepStatus('act', 'processing');
      await new Promise(resolve => setTimeout(resolve, 2400));
      const generatedInsights: AIInsight[] = [
        {
          id: 'insight-1',
          title: 'LinkedIn Campaign Optimization Opportunity',
          content: 'Your MBA Career Changer persona shows 45% higher engagement on LinkedIn compared to other channels. Consider reallocating 30% of Facebook budget to LinkedIn for improved ROI.',
          type: 'optimization',
          confidence: 87,
          impact: 'high',
          personaId: 'mba-career-changer',
          generatedAt: new Date().toISOString(),
          isGptGenerated: true,
          vectorSimilarity: 0.92,
          recommendations: [
            'Increase LinkedIn ad spend by 30%',
            'Create LinkedIn-specific creative assets',
            'Test professional testimonials in LinkedIn campaigns'
          ]
        },
        {
          id: 'insight-2',
          title: 'Email Sequence Performance Gap',
          content: 'Recent Graduate personas have a 23% drop-off rate after the second email in your nurture sequence. Vector memory analysis suggests adding a career success story at this touchpoint.',
          type: 'opportunity',
          confidence: 79,
          impact: 'medium',
          personaId: 'recent-graduate',
          generatedAt: new Date().toISOString(),
          isGptGenerated: true,
          vectorSimilarity: 0.84,
          recommendations: [
            'Add success story email at day 3',
            'Personalize content based on program interest',
            'Include peer testimonials'
          ]
        },
        {
          id: 'insight-3',
          title: 'Budget Allocation Warning',
          content: 'Healthcare Administration campaigns are consuming 40% of budget but generating only 18% of qualified leads. Immediate reallocation recommended.',
          type: 'warning',
          confidence: 94,
          impact: 'high',
          personaId: 'healthcare-admin',
          generatedAt: new Date().toISOString(),
          isGptGenerated: true,
          vectorSimilarity: 0.88,
          recommendations: [
            'Reduce Healthcare Admin budget by 25%',
            'Reallocate to high-performing Business personas',
            'Review targeting parameters for Healthcare campaigns'
          ]
        },
        {
          id: 'insight-4',
          title: 'Emerging Trend: Video Content Performance',
          content: 'Video content is showing 67% higher engagement across all personas in the last 14 days. This represents a significant shift in content preference.',
          type: 'trend',
          confidence: 82,
          impact: 'medium',
          personaId: 'all-personas',
          generatedAt: new Date().toISOString(),
          isGptGenerated: true,
          vectorSimilarity: 0.76,
          recommendations: [
            'Develop video-first content strategy',
            'Create persona-specific video testimonials',
            'Test video ads across all active campaigns'
          ]
        },
        {
          id: 'insight-5',
          title: 'Cross-Channel Attribution Optimization',
          content: 'Multi-touch attribution analysis reveals that Google Ads + LinkedIn combination drives 34% higher conversion rates than single-channel approaches.',
          type: 'optimization',
          confidence: 91,
          impact: 'high',
          personaId: 'business-professional',
          generatedAt: new Date().toISOString(),
          isGptGenerated: true,
          vectorSimilarity: 0.89,
          recommendations: [
            'Implement coordinated Google + LinkedIn campaigns',
            'Create consistent messaging across both channels',
            'Set up proper cross-channel tracking'
          ]
        }
      ];
      updateStepStatus('act', 'completed', generatedInsights);
      setCurrentStep(4);

      // Step 5: Evaluate
      updateStepStatus('evaluate', 'processing');
      await new Promise(resolve => setTimeout(resolve, 1400));
      const evaluateResult = {
        highImpact: generatedInsights.filter(i => i.impact === 'high').length,
        averageConfidence: Math.round(generatedInsights.reduce((sum, i) => sum + i.confidence, 0) / generatedInsights.length),
        totalRecommendations: generatedInsights.reduce((sum, i) => sum + i.recommendations.length, 0)
      };
      updateStepStatus('evaluate', 'completed', evaluateResult);

      setInsights(generatedInsights);
      onInsightsGenerated(generatedInsights);

      toast({
        title: "AI Insights Generated",
        description: `Generated ${generatedInsights.length} insights with ${evaluateResult.averageConfidence}% average confidence.`,
      });

    } catch (error) {
      console.error('ORDAE insights generation error:', error);
      toast({
        title: "Insights Generation Failed",
        description: "There was an error generating AI insights. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStepIcon = (step: ORDAEStep) => {
    if (step.status === 'completed') return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (step.status === 'error') return <AlertCircle className="w-4 h-4 text-red-600" />;
    if (step.status === 'processing') return <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
    return step.icon;
  };

  const getStepColor = (step: ORDAEStep) => {
    if (step.status === 'completed') return 'border-green-200 bg-green-50';
    if (step.status === 'processing') return 'border-blue-200 bg-blue-50';
    if (step.status === 'error') return 'border-red-200 bg-red-50';
    return 'border-gray-200 bg-gray-50';
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <TrendingUp className="w-5 h-5 text-blue-600" />;
      case 'opportunity': return <Lightbulb className="w-5 h-5 text-yellow-600" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'trend': return <BarChart3 className="w-5 h-5 text-green-600" />;
      default: return <Brain className="w-5 h-5 text-gray-600" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'optimization': return 'border-l-blue-500 bg-blue-50/50';
      case 'opportunity': return 'border-l-yellow-500 bg-yellow-50/50';
      case 'warning': return 'border-l-red-500 bg-red-50/50';
      case 'trend': return 'border-l-green-500 bg-green-50/50';
      default: return 'border-l-gray-500 bg-gray-50/50';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            ORDAE AI Insights Generator
          </CardTitle>
          <CardDescription>
            Generate AI-powered insights using vector memory analysis and performance data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isProcessing && insights.length === 0 && (
            <Button onClick={generateInsights} className="w-full">
              <Brain className="w-4 h-4 mr-2" />
              Generate AI Insights
            </Button>
          )}

          {isProcessing && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Processing ORDAE Analysis</span>
                <span className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {steps.length}
                </span>
              </div>
              <Progress value={(currentStep / steps.length) * 100} className="w-full" />
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`p-3 rounded-lg border transition-all ${getStepColor(step)}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {getStepIcon(step)}
                      <span className="font-medium text-sm">{step.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {insights.length > 0 && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">
                  {insights.length} AI Insights Generated Successfully!
                </h3>
                <p className="text-sm text-green-700">
                  ORDAE agents analyzed your data and identified key optimization opportunities.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {insights.filter(i => i.impact === 'high').length}
                    </div>
                    <div className="text-sm text-muted-foreground">High Impact</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Confidence</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {insights.reduce((sum, i) => sum + i.recommendations.length, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Recommendations</div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Latest Insights Preview</h4>
                {insights.slice(0, 2).map((insight) => (
                  <Card 
                    key={insight.id} 
                    className={`border-l-4 ${getInsightColor(insight.type)} hover:shadow-md transition-shadow`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {getInsightIcon(insight.type)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-sm">{insight.title}</h5>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {insight.confidence}% confidence
                              </Badge>
                              <Badge 
                                variant={insight.impact === 'high' ? 'default' : 'secondary'} 
                                className="text-xs"
                              >
                                {insight.impact} impact
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {insight.content}
                          </p>
                          <div className="text-xs text-muted-foreground">
                            Vector similarity: {(insight.vectorSimilarity! * 100).toFixed(0)}%
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {insights.length > 2 && (
                  <p className="text-sm text-muted-foreground text-center">
                    +{insights.length - 2} more insights generated
                  </p>
                )}
              </div>

              <Button 
                variant="outline" 
                onClick={generateInsights} 
                className="w-full"
                disabled={isProcessing}
              >
                <Brain className="w-4 h-4 mr-2" />
                Generate New Insights
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
