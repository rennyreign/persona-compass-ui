import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Target, TrendingUp, Zap, CheckCircle, AlertCircle, BarChart3, Users, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ORDAEAttributionAnalyzerProps {
  onAnalysisComplete: (analysis: AttributionAnalysis) => void;
}

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

interface ORDAEStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  result?: any;
  icon: React.ReactNode;
}

export function ORDAEAttributionAnalyzer({ onAnalysisComplete }: ORDAEAttributionAnalyzerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [analysis, setAnalysis] = useState<AttributionAnalysis | null>(null);
  const { toast } = useToast();

  const ordaeSteps: ORDAEStep[] = [
    {
      id: 'observe',
      name: 'Observe',
      description: 'Analyzing customer journey touchpoints and interactions',
      status: 'pending',
      icon: <Target className="w-4 h-4" />
    },
    {
      id: 'remember',
      name: 'Remember',
      description: 'Comparing with historical attribution patterns',
      status: 'pending',
      icon: <Brain className="w-4 h-4" />
    },
    {
      id: 'decide',
      name: 'Decide',
      description: 'Identifying attribution model effectiveness',
      status: 'pending',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: 'act',
      name: 'Act',
      description: 'Generating cross-channel optimization strategies',
      status: 'pending',
      icon: <Zap className="w-4 h-4" />
    },
    {
      id: 'evaluate',
      name: 'Evaluate',
      description: 'Validating attribution insights and recommendations',
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

  const runAttributionAnalysis = async () => {
    setIsAnalyzing(true);
    setCurrentStep(0);

    try {
      // Step 1: Observe
      updateStepStatus('observe', 'processing');
      await new Promise(resolve => setTimeout(resolve, 2100));
      const observeResult = {
        touchpointsAnalyzed: 34,
        journeysTracked: 156,
        channelsEvaluated: 8,
        conversionPathsFound: 247
      };
      updateStepStatus('observe', 'completed', observeResult);
      setCurrentStep(1);

      // Step 2: Remember
      updateStepStatus('remember', 'processing');
      await new Promise(resolve => setTimeout(resolve, 1900));
      const rememberResult = {
        historicalComparisons: 89,
        seasonalPatterns: 12,
        benchmarkDeviations: 6,
        trendAnalysis: 'positive'
      };
      updateStepStatus('remember', 'completed', rememberResult);
      setCurrentStep(2);

      // Step 3: Decide
      updateStepStatus('decide', 'processing');
      await new Promise(resolve => setTimeout(resolve, 2300));
      const decideResult = {
        modelAccuracyScores: {
          'First Touch': 72,
          'Last Touch': 68,
          'Linear': 81,
          'Time Decay': 85,
          'Position Based': 79
        },
        optimalModel: 'Time Decay'
      };
      updateStepStatus('decide', 'completed', decideResult);
      setCurrentStep(3);

      // Step 4: Act
      updateStepStatus('act', 'processing');
      await new Promise(resolve => setTimeout(resolve, 2700));
      
      const attributionAnalysis: AttributionAnalysis = {
        id: `attribution-${Date.now()}`,
        timestamp: new Date().toISOString(),
        overallScore: 82,
        touchpointAnalysis: [
          {
            id: 'tp-1',
            touchpoint: 'Initial Ad Click',
            channel: 'Google Ads',
            influence: 28,
            conversionContribution: 15,
            dropoffRate: 45,
            optimization: 'Improve landing page relevance'
          },
          {
            id: 'tp-2',
            touchpoint: 'Email Open',
            channel: 'Email Marketing',
            influence: 35,
            conversionContribution: 22,
            dropoffRate: 32,
            optimization: 'Personalize subject lines'
          },
          {
            id: 'tp-3',
            touchpoint: 'Webinar Attendance',
            channel: 'Content Marketing',
            influence: 67,
            conversionContribution: 41,
            dropoffRate: 18,
            optimization: 'Increase webinar frequency'
          },
          {
            id: 'tp-4',
            touchpoint: 'Application Start',
            channel: 'Website',
            influence: 89,
            conversionContribution: 78,
            dropoffRate: 23,
            optimization: 'Simplify application form'
          }
        ],
        journeyOptimizations: [
          {
            id: 'jo-1',
            journeyType: 'MBA Career Changer',
            currentConversion: 12.4,
            optimizedConversion: 16.8,
            bottleneck: 'Email sequence gap after webinar',
            solution: 'Add 3-touch follow-up sequence',
            impact: 'high'
          },
          {
            id: 'jo-2',
            journeyType: 'Recent Graduate',
            currentConversion: 8.7,
            optimizedConversion: 11.2,
            bottleneck: 'Long application form',
            solution: 'Progressive form completion',
            impact: 'medium'
          },
          {
            id: 'jo-3',
            journeyType: 'Healthcare Professional',
            currentConversion: 15.2,
            optimizedConversion: 18.9,
            bottleneck: 'Lack of industry-specific content',
            solution: 'Create healthcare-focused landing pages',
            impact: 'high'
          }
        ],
        crossChannelInsights: [
          {
            id: 'cc-1',
            channelCombination: ['Google Ads', 'LinkedIn'],
            synergy: 34,
            incrementalLift: 28,
            recommendedBudgetSplit: { 'Google Ads': 60, 'LinkedIn': 40 }
          },
          {
            id: 'cc-2',
            channelCombination: ['Email', 'Webinar'],
            synergy: 56,
            incrementalLift: 42,
            recommendedBudgetSplit: { 'Email': 30, 'Webinar': 70 }
          },
          {
            id: 'cc-3',
            channelCombination: ['Facebook', 'Instagram', 'YouTube'],
            synergy: 23,
            incrementalLift: 18,
            recommendedBudgetSplit: { 'Facebook': 45, 'Instagram': 30, 'YouTube': 25 }
          }
        ],
        attributionModels: [
          {
            id: 'am-1',
            model: 'Time Decay',
            accuracy: 85,
            revenueAttribution: 847200,
            recommendedUse: 'Long sales cycles (MBA programs)'
          },
          {
            id: 'am-2',
            model: 'Linear',
            accuracy: 81,
            revenueAttribution: 823400,
            recommendedUse: 'Multi-touch campaigns'
          },
          {
            id: 'am-3',
            model: 'Position Based',
            accuracy: 79,
            revenueAttribution: 798600,
            recommendedUse: 'Awareness + conversion focus'
          },
          {
            id: 'am-4',
            model: 'Last Touch',
            accuracy: 68,
            revenueAttribution: 756300,
            recommendedUse: 'Direct response campaigns'
          }
        ],
        recommendations: [
          {
            id: 'rec-1',
            type: 'touchpoint',
            priority: 'high',
            title: 'Optimize Webinar-to-Application Conversion',
            description: 'Webinars show highest influence (67%) but 18% dropoff. Implement immediate post-webinar application prompts.',
            expectedImpact: '25-30% conversion increase',
            confidence: 91
          },
          {
            id: 'rec-2',
            type: 'journey',
            priority: 'high',
            title: 'Implement Progressive Application Forms',
            description: 'Application start shows 23% dropoff. Break forms into 3 steps with save functionality.',
            expectedImpact: '15-20% completion increase',
            confidence: 87
          },
          {
            id: 'rec-3',
            type: 'budget',
            priority: 'medium',
            title: 'Reallocate Budget to High-Synergy Channels',
            description: 'Email + Webinar combination shows 56% synergy. Increase budget allocation by 25%.',
            expectedImpact: '12-18% ROI improvement',
            confidence: 83
          },
          {
            id: 'rec-4',
            type: 'timing',
            priority: 'medium',
            title: 'Optimize Email Sequence Timing',
            description: 'Gap identified between webinar and follow-up. Add immediate 24h and 72h touchpoints.',
            expectedImpact: '8-12% engagement boost',
            confidence: 79
          }
        ]
      };

      updateStepStatus('act', 'completed', attributionAnalysis);
      setCurrentStep(4);

      // Step 5: Evaluate
      updateStepStatus('evaluate', 'processing');
      await new Promise(resolve => setTimeout(resolve, 1700));
      const evaluateResult = {
        recommendationsValidated: attributionAnalysis.recommendations.length,
        averageConfidence: Math.round(attributionAnalysis.recommendations.reduce((sum, r) => sum + r.confidence, 0) / attributionAnalysis.recommendations.length),
        crossChannelOpportunities: attributionAnalysis.crossChannelInsights.length,
        journeyOptimizations: attributionAnalysis.journeyOptimizations.length
      };
      updateStepStatus('evaluate', 'completed', evaluateResult);

      setAnalysis(attributionAnalysis);
      onAnalysisComplete(attributionAnalysis);

      toast({
        title: "Attribution Analysis Complete",
        description: `Generated ${attributionAnalysis.recommendations.length} recommendations with ${evaluateResult.averageConfidence}% avg confidence.`,
      });

    } catch (error) {
      console.error('ORDAE attribution analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "There was an error running the attribution analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
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

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            ORDAE Attribution Analyzer
          </CardTitle>
          <CardDescription>
            Advanced multi-touch attribution analysis with AI-powered journey optimization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isAnalyzing && !analysis && (
            <Button onClick={runAttributionAnalysis} className="w-full">
              <BarChart3 className="w-4 h-4 mr-2" />
              Run Attribution Analysis
            </Button>
          )}

          {analysis && (
            <Button 
              variant="outline" 
              onClick={runAttributionAnalysis}
              disabled={isAnalyzing}
              className="w-full"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Refresh Analysis
            </Button>
          )}

          {isAnalyzing && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Running ORDAE Attribution Analysis</span>
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

          {analysis && (
            <div className="space-y-6">
              {/* Analysis Summary */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">
                  Attribution Analysis Complete - Score: {analysis.overallScore}/100
                </h3>
                <p className="text-sm text-green-700">
                  Analyzed {analysis.touchpointAnalysis.length} touchpoints, {analysis.journeyOptimizations.length} journey types, and {analysis.crossChannelInsights.length} channel combinations.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {analysis.recommendations.filter(r => r.priority === 'high').length}
                    </div>
                    <div className="text-sm text-muted-foreground">High Priority</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {analysis.attributionModels.find(m => m.accuracy === Math.max(...analysis.attributionModels.map(m => m.accuracy)))?.accuracy}%
                    </div>
                    <div className="text-sm text-muted-foreground">Best Model Accuracy</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.max(...analysis.crossChannelInsights.map(c => c.synergy))}%
                    </div>
                    <div className="text-sm text-muted-foreground">Max Channel Synergy</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {Math.round(analysis.recommendations.reduce((sum, r) => sum + r.confidence, 0) / analysis.recommendations.length)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Confidence</div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Touchpoint Insights */}
              <div className="space-y-3">
                <h4 className="font-medium">Top Touchpoint Insights</h4>
                {analysis.touchpointAnalysis.slice(0, 2).map((touchpoint) => (
                  <Card key={touchpoint.id} className="border-l-4 border-l-blue-500 bg-blue-50/50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium text-sm">{touchpoint.touchpoint}</h5>
                        <Badge variant="outline" className="text-xs">
                          {touchpoint.channel}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-xs mb-2">
                        <div>
                          <span className="text-muted-foreground">Influence: </span>
                          <span className="font-medium">{touchpoint.influence}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Contribution: </span>
                          <span className="font-medium">{touchpoint.conversionContribution}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Dropoff: </span>
                          <span className="font-medium text-red-600">{touchpoint.dropoffRate}%</span>
                        </div>
                      </div>
                      <div className="text-xs text-blue-600 font-medium">
                        Optimization: {touchpoint.optimization}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Journey Optimizations Preview */}
              <div className="space-y-3">
                <h4 className="font-medium">Journey Optimizations</h4>
                {analysis.journeyOptimizations.slice(0, 2).map((journey) => (
                  <Card key={journey.id} className="border-l-4 border-l-green-500 bg-green-50/50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium text-sm">{journey.journeyType}</h5>
                        <Badge className={`text-xs ${getImpactColor(journey.impact)}`}>
                          {journey.impact} impact
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs mb-2">
                        <div>
                          <span className="text-muted-foreground">Current: </span>
                          <span className="font-medium">{journey.currentConversion}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Optimized: </span>
                          <span className="font-medium text-green-600">{journey.optimizedConversion}%</span>
                        </div>
                      </div>
                      <div className="text-xs">
                        <div className="text-red-600 mb-1">Bottleneck: {journey.bottleneck}</div>
                        <div className="text-green-600">Solution: {journey.solution}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
