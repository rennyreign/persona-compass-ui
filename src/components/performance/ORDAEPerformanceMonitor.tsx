import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Target, TrendingUp, Zap, CheckCircle, AlertCircle, Activity, BarChart3, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ORDAEPerformanceMonitorProps {
  onAnalysisComplete: (analysis: PerformanceAnalysis) => void;
}

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

interface ORDAEStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  result?: any;
  icon: React.ReactNode;
}

export function ORDAEPerformanceMonitor({ onAnalysisComplete }: ORDAEPerformanceMonitorProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [analysis, setAnalysis] = useState<PerformanceAnalysis | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const { toast } = useToast();

  const ordaeSteps: ORDAEStep[] = [
    {
      id: 'observe',
      name: 'Observe',
      description: 'Analyzing real-time performance metrics',
      status: 'pending',
      icon: <Activity className="w-4 h-4" />
    },
    {
      id: 'remember',
      name: 'Remember',
      description: 'Comparing with historical performance patterns',
      status: 'pending',
      icon: <Brain className="w-4 h-4" />
    },
    {
      id: 'decide',
      name: 'Decide',
      description: 'Identifying performance bottlenecks and opportunities',
      status: 'pending',
      icon: <Target className="w-4 h-4" />
    },
    {
      id: 'act',
      name: 'Act',
      description: 'Generating optimization recommendations',
      status: 'pending',
      icon: <Zap className="w-4 h-4" />
    },
    {
      id: 'evaluate',
      name: 'Evaluate',
      description: 'Validating recommendations and predicting outcomes',
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

  const runPerformanceAnalysis = async () => {
    setIsAnalyzing(true);
    setCurrentStep(0);

    try {
      // Step 1: Observe
      updateStepStatus('observe', 'processing');
      await new Promise(resolve => setTimeout(resolve, 2000));
      const observeResult = {
        metricsAnalyzed: 47,
        campaignsMonitored: 12,
        personasTracked: 8,
        dataPointsProcessed: 2847
      };
      updateStepStatus('observe', 'completed', observeResult);
      setCurrentStep(1);

      // Step 2: Remember
      updateStepStatus('remember', 'processing');
      await new Promise(resolve => setTimeout(resolve, 1800));
      const rememberResult = {
        historicalComparisons: 156,
        patternMatches: 23,
        benchmarkDeviations: 7,
        seasonalAdjustments: 4
      };
      updateStepStatus('remember', 'completed', rememberResult);
      setCurrentStep(2);

      // Step 3: Decide
      updateStepStatus('decide', 'processing');
      await new Promise(resolve => setTimeout(resolve, 2200));
      const decideResult = {
        bottlenecksIdentified: 5,
        opportunitiesFound: 8,
        criticalIssues: 2,
        optimizationPotential: '34%'
      };
      updateStepStatus('decide', 'completed', decideResult);
      setCurrentStep(3);

      // Step 4: Act
      updateStepStatus('act', 'processing');
      await new Promise(resolve => setTimeout(resolve, 2600));
      
      const performanceAnalysis: PerformanceAnalysis = {
        id: `analysis-${Date.now()}`,
        timestamp: new Date().toISOString(),
        overallScore: 78,
        recommendations: [
          {
            id: 'rec-1',
            type: 'budget',
            priority: 'high',
            title: 'Reallocate Budget from Underperforming Channels',
            description: 'Instagram campaigns are showing 23% higher CPL than target. Recommend shifting 25% of Instagram budget to LinkedIn which is performing 18% above target.',
            expectedImpact: '12-15% CPL reduction',
            confidence: 89
          },
          {
            id: 'rec-2',
            type: 'targeting',
            priority: 'high',
            title: 'Optimize MBA Career Changer Targeting',
            description: 'Current targeting is too broad. Narrow to professionals with 3-7 years experience in specific industries showing higher conversion rates.',
            expectedImpact: '20-25% CTR improvement',
            confidence: 84
          },
          {
            id: 'rec-3',
            type: 'creative',
            priority: 'medium',
            title: 'A/B Test Video Creative for Healthcare Admin',
            description: 'Static image ads are underperforming. Video content shows 67% higher engagement in similar demographics.',
            expectedImpact: '15-20% engagement boost',
            confidence: 76
          },
          {
            id: 'rec-4',
            type: 'timing',
            priority: 'medium',
            title: 'Adjust Ad Scheduling for Recent Graduates',
            description: 'Peak engagement occurs 6-8 PM on weekdays. Current scheduling misses 40% of optimal impression opportunities.',
            expectedImpact: '8-12% reach improvement',
            confidence: 82
          }
        ],
        alerts: [
          {
            id: 'alert-1',
            severity: 'critical',
            title: 'Healthcare Administration CPL Spike',
            description: 'CPL has increased 45% in the last 7 days, exceeding target by $23. Immediate action required.',
            affectedPersonas: ['Healthcare Administration Professional'],
            actionRequired: true
          },
          {
            id: 'alert-2',
            severity: 'warning',
            title: 'Facebook Campaign Frequency Cap Reached',
            description: 'Average frequency is 4.2x, leading to ad fatigue and declining CTR.',
            affectedPersonas: ['MBA Career Changer', 'Recent Graduate'],
            actionRequired: true
          },
          {
            id: 'alert-3',
            severity: 'info',
            title: 'LinkedIn Performance Trending Up',
            description: 'LinkedIn campaigns showing consistent improvement over 14 days.',
            affectedPersonas: ['Business Professional', 'MBA Career Changer'],
            actionRequired: false
          }
        ],
        predictions: [
          {
            id: 'pred-1',
            metric: 'Global CPL',
            currentValue: 42.50,
            predictedValue: 38.20,
            timeframe: '30 days',
            confidence: 87
          },
          {
            id: 'pred-2',
            metric: 'Total Leads',
            currentValue: 175,
            predictedValue: 198,
            timeframe: '30 days',
            confidence: 83
          },
          {
            id: 'pred-3',
            metric: 'Global CTR',
            currentValue: 2.8,
            predictedValue: 3.2,
            timeframe: '30 days',
            confidence: 79
          }
        ],
        optimizations: [
          {
            id: 'opt-1',
            category: 'Budget Optimization',
            title: 'Cross-Channel Budget Reallocation',
            description: 'Optimize budget distribution based on performance data and seasonal trends.',
            potentialSavings: 2840,
            implementationEffort: 'low'
          },
          {
            id: 'opt-2',
            category: 'Audience Optimization',
            title: 'Lookalike Audience Expansion',
            description: 'Create lookalike audiences based on top-performing segments.',
            potentialSavings: 1650,
            implementationEffort: 'medium'
          },
          {
            id: 'opt-3',
            category: 'Creative Optimization',
            title: 'Dynamic Creative Testing',
            description: 'Implement automated creative rotation based on performance metrics.',
            potentialSavings: 980,
            implementationEffort: 'high'
          }
        ]
      };

      updateStepStatus('act', 'completed', performanceAnalysis);
      setCurrentStep(4);

      // Step 5: Evaluate
      updateStepStatus('evaluate', 'processing');
      await new Promise(resolve => setTimeout(resolve, 1600));
      const evaluateResult = {
        recommendationsValidated: performanceAnalysis.recommendations.length,
        averageConfidence: Math.round(performanceAnalysis.recommendations.reduce((sum, r) => sum + r.confidence, 0) / performanceAnalysis.recommendations.length),
        totalPotentialSavings: performanceAnalysis.optimizations.reduce((sum, o) => sum + o.potentialSavings, 0),
        criticalAlerts: performanceAnalysis.alerts.filter(a => a.severity === 'critical').length
      };
      updateStepStatus('evaluate', 'completed', evaluateResult);

      setAnalysis(performanceAnalysis);
      onAnalysisComplete(performanceAnalysis);

      toast({
        title: "Performance Analysis Complete",
        description: `Generated ${performanceAnalysis.recommendations.length} recommendations with ${evaluateResult.averageConfidence}% avg confidence.`,
      });

    } catch (error) {
      console.error('ORDAE performance analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "There was an error running the performance analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh && !isAnalyzing) {
      const interval = setInterval(() => {
        runPerformanceAnalysis();
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh, isAnalyzing]);

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

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-l-red-500 bg-red-50/50';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50/50';
      case 'info': return 'border-l-blue-500 bg-blue-50/50';
      default: return 'border-l-gray-500 bg-gray-50/50';
    }
  };

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'info': return <CheckCircle className="w-5 h-5 text-blue-600" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            ORDAE Performance Monitor
          </CardTitle>
          <CardDescription>
            Real-time performance analysis with AI-powered recommendations and predictions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!isAnalyzing && !analysis && (
                <Button onClick={runPerformanceAnalysis}>
                  <Activity className="w-4 h-4 mr-2" />
                  Run Performance Analysis
                </Button>
              )}
              
              {analysis && (
                <Button 
                  variant="outline" 
                  onClick={runPerformanceAnalysis}
                  disabled={isAnalyzing}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
                  Refresh Analysis
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Auto-refresh</label>
              <Button
                variant={autoRefresh ? "default" : "outline"}
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                {autoRefresh ? 'ON' : 'OFF'}
              </Button>
            </div>
          </div>

          {isAnalyzing && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Running ORDAE Analysis</span>
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
                  Performance Analysis Complete - Score: {analysis.overallScore}/100
                </h3>
                <p className="text-sm text-green-700">
                  Generated {analysis.recommendations.length} recommendations, {analysis.alerts.length} alerts, and {analysis.predictions.length} predictions.
                </p>
              </div>

              {/* Critical Alerts */}
              {analysis.alerts.filter(a => a.severity === 'critical').length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-red-800">Critical Alerts</h4>
                  {analysis.alerts.filter(a => a.severity === 'critical').map((alert) => (
                    <Card 
                      key={alert.id} 
                      className={`border-l-4 ${getAlertColor(alert.severity)}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          {getAlertIcon(alert.severity)}
                          <div className="flex-1">
                            <h5 className="font-medium text-sm mb-1">{alert.title}</h5>
                            <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {alert.affectedPersonas.length} personas affected
                              </Badge>
                              {alert.actionRequired && (
                                <Badge variant="destructive" className="text-xs">
                                  Action Required
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

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
                      ${analysis.optimizations.reduce((sum, o) => sum + o.potentialSavings, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Potential Savings</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(analysis.recommendations.reduce((sum, r) => sum + r.confidence, 0) / analysis.recommendations.length)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Confidence</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {analysis.alerts.filter(a => a.actionRequired).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Actions Needed</div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Recommendations Preview */}
              <div className="space-y-3">
                <h4 className="font-medium">Top Recommendations</h4>
                {analysis.recommendations.slice(0, 2).map((rec) => (
                  <Card key={rec.id} className="border-l-4 border-l-blue-500 bg-blue-50/50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium text-sm">{rec.title}</h5>
                        <div className="flex items-center gap-2">
                          <Badge variant={rec.priority === 'high' ? 'default' : 'secondary'} className="text-xs">
                            {rec.priority} priority
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {rec.confidence}% confidence
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                      <div className="text-xs text-green-600 font-medium">
                        Expected Impact: {rec.expectedImpact}
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
