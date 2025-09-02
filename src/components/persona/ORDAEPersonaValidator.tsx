import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Eye, 
  Database, 
  Target, 
  Play, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Users,
  Lightbulb,
  BarChart3,
  Zap,
  Shield,
  Clock,
  Star,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PersonaValidationResult {
  id: string;
  personaId: string;
  timestamp: string;
  overallScore: number;
  validationStatus: 'excellent' | 'good' | 'needs_improvement' | 'critical';
  demographicAccuracy: number;
  behavioralAlignment: number;
  marketFit: number;
  campaignEffectiveness: number;
  recommendations: ValidationRecommendation[];
  optimizations: PersonaOptimization[];
  riskFactors: RiskFactor[];
  competitiveAnalysis: CompetitiveInsight[];
}

interface ValidationRecommendation {
  id: string;
  category: 'demographic' | 'behavioral' | 'messaging' | 'channels' | 'timing';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  expectedImpact: string;
  confidence: number;
  implementation: string;
}

interface PersonaOptimization {
  id: string;
  field: string;
  currentValue: string;
  optimizedValue: string;
  improvementScore: number;
  rationale: string;
  dataSource: string;
}

interface RiskFactor {
  id: string;
  type: 'market_shift' | 'competition' | 'demographic_change' | 'behavior_evolution';
  severity: 'high' | 'medium' | 'low';
  description: string;
  probability: number;
  impact: string;
  mitigation: string;
}

interface CompetitiveInsight {
  id: string;
  competitor: string;
  targetingSimilarity: number;
  differentiationOpportunity: string;
  marketShare: number;
  recommendedStrategy: string;
}

interface ORDAEStep {
  step: 'observe' | 'remember' | 'decide' | 'act' | 'evaluate';
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  description: string;
  result?: string;
  insights?: string[];
}

interface ORDAEPersonaValidatorProps {
  personaId: string;
  personaName: string;
  onValidationComplete: (result: PersonaValidationResult) => void;
}

export function ORDAEPersonaValidator({ personaId, personaName, onValidationComplete }: ORDAEPersonaValidatorProps) {
  const [isValidating, setIsValidating] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [steps, setSteps] = useState<ORDAEStep[]>([]);
  const [result, setResult] = useState<PersonaValidationResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    initializeSteps();
  }, []);

  const initializeSteps = () => {
    const initialSteps: ORDAEStep[] = [
      {
        step: 'observe',
        status: 'pending',
        progress: 0,
        description: 'Analyzing persona data and market conditions',
        insights: []
      },
      {
        step: 'remember',
        status: 'pending',
        progress: 0,
        description: 'Retrieving similar persona patterns from vector memory',
        insights: []
      },
      {
        step: 'decide',
        status: 'pending',
        progress: 0,
        description: 'Evaluating persona effectiveness and optimization opportunities',
        insights: []
      },
      {
        step: 'act',
        status: 'pending',
        progress: 0,
        description: 'Generating validation scores and recommendations',
        insights: []
      },
      {
        step: 'evaluate',
        status: 'pending',
        progress: 0,
        description: 'Assessing validation quality and confidence levels',
        insights: []
      }
    ];
    setSteps(initialSteps);
  };

  const startValidation = async () => {
    setIsValidating(true);
    setCurrentStep(0);
    setResult(null);

    // Simulate ORDAE workflow
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      await processStep(i);
    }

    // Generate final result
    const validationResult = generateValidationResult();
    setResult(validationResult);
    onValidationComplete(validationResult);
    setIsValidating(false);

    toast({
      title: "Persona Validation Complete",
      description: `${personaName} validation completed with ${validationResult.overallScore}/100 score`,
    });
  };

  const processStep = async (stepIndex: number): Promise<void> => {
    return new Promise((resolve) => {
      setSteps(prev => prev.map((step, idx) => 
        idx === stepIndex 
          ? { ...step, status: 'processing' }
          : step
      ));

      // Simulate processing with progress updates
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 25;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          // Complete the step with results
          setSteps(prev => prev.map((step, idx) => 
            idx === stepIndex 
              ? { 
                  ...step, 
                  status: 'completed', 
                  progress: 100,
                  result: getStepResult(step.step),
                  insights: getStepInsights(step.step)
                }
              : step
          ));
          
          setTimeout(resolve, 500);
        } else {
          setSteps(prev => prev.map((step, idx) => 
            idx === stepIndex 
              ? { ...step, progress }
              : step
          ));
        }
      }, 200);
    });
  };

  const getStepResult = (step: ORDAEStep['step']): string => {
    switch (step) {
      case 'observe':
        return 'Analyzed 47 data points across demographics, behavior, and market conditions';
      case 'remember':
        return 'Retrieved 12 similar persona patterns with 0.87 average similarity score';
      case 'decide':
        return 'Identified 8 optimization opportunities with high confidence scores';
      case 'act':
        return 'Generated comprehensive validation with 94% accuracy rating';
      case 'evaluate':
        return 'Validation quality score: 91/100 with high confidence intervals';
      default:
        return 'Step completed successfully';
    }
  };

  const getStepInsights = (step: ORDAEStep['step']): string[] => {
    switch (step) {
      case 'observe':
        return [
          'Strong demographic alignment in age and education',
          'Behavioral patterns match target market trends',
          'Geographic distribution shows growth opportunities'
        ];
      case 'remember':
        return [
          'Similar personas show 23% higher conversion rates',
          'Successful messaging patterns identified',
          'Channel preferences align with historical data'
        ];
      case 'decide':
        return [
          'Messaging optimization could improve engagement by 18%',
          'Channel mix adjustment recommended',
          'Timing optimization shows 12% uplift potential'
        ];
      case 'act':
        return [
          'Generated 15 specific recommendations',
          'Identified 3 high-priority optimizations',
          'Risk assessment completed for market changes'
        ];
      case 'evaluate':
        return [
          'Validation methodology shows high accuracy',
          'Confidence intervals within acceptable ranges',
          'Recommendations backed by strong data evidence'
        ];
      default:
        return [];
    }
  };

  const generateValidationResult = (): PersonaValidationResult => {
    const mockResult: PersonaValidationResult = {
      id: `validation-${Date.now()}`,
      personaId,
      timestamp: new Date().toISOString(),
      overallScore: 87,
      validationStatus: 'good',
      demographicAccuracy: 92,
      behavioralAlignment: 85,
      marketFit: 89,
      campaignEffectiveness: 82,
      recommendations: [
        {
          id: 'rec-1',
          category: 'messaging',
          priority: 'high',
          title: 'Optimize Value Proposition Messaging',
          description: 'Current messaging focuses on features rather than outcomes. Shift to benefit-driven language.',
          expectedImpact: '+18% engagement rate',
          confidence: 89,
          implementation: 'Update campaign copy to emphasize career advancement outcomes'
        },
        {
          id: 'rec-2',
          category: 'channels',
          priority: 'high',
          title: 'Increase LinkedIn Investment',
          description: 'LinkedIn shows 34% higher conversion rates for this persona compared to current mix.',
          expectedImpact: '+12% conversion rate',
          confidence: 94,
          implementation: 'Reallocate 25% of Facebook budget to LinkedIn campaigns'
        },
        {
          id: 'rec-3',
          category: 'timing',
          priority: 'medium',
          title: 'Adjust Campaign Timing',
          description: 'Peak engagement occurs Tuesday-Thursday 7-9 PM, not current Monday-Friday schedule.',
          expectedImpact: '+8% click-through rate',
          confidence: 76,
          implementation: 'Reschedule ad delivery to optimize for peak engagement windows'
        },
        {
          id: 'rec-4',
          category: 'demographic',
          priority: 'medium',
          title: 'Expand Age Range',
          description: 'Similar personas in 35-40 age range show strong performance indicators.',
          expectedImpact: '+15% audience reach',
          confidence: 82,
          implementation: 'Test campaigns with expanded age targeting 28-40 vs current 28-35'
        },
        {
          id: 'rec-5',
          category: 'behavioral',
          priority: 'low',
          title: 'Add Interest Targeting',
          description: 'Professional development and certification interests show high correlation.',
          expectedImpact: '+6% relevance score',
          confidence: 71,
          implementation: 'Include professional development interests in targeting criteria'
        }
      ],
      optimizations: [
        {
          id: 'opt-1',
          field: 'Primary Motivation',
          currentValue: 'Career advancement',
          optimizedValue: 'Salary increase and career security',
          improvementScore: 23,
          rationale: 'More specific motivations resonate better with target audience',
          dataSource: 'Survey data from 1,247 similar professionals'
        },
        {
          id: 'opt-2',
          field: 'Preferred Content Type',
          currentValue: 'Blog articles',
          optimizedValue: 'Video testimonials and case studies',
          improvementScore: 31,
          rationale: 'Visual content shows 45% higher engagement for this demographic',
          dataSource: 'Campaign performance analysis across 23 similar personas'
        },
        {
          id: 'opt-3',
          field: 'Decision Timeline',
          currentValue: '3-6 months',
          optimizedValue: '2-4 months with urgency triggers',
          improvementScore: 18,
          rationale: 'Urgency messaging can accelerate decision-making without reducing quality',
          dataSource: 'Conversion funnel analysis and competitor benchmarking'
        }
      ],
      riskFactors: [
        {
          id: 'risk-1',
          type: 'market_shift',
          severity: 'medium',
          description: 'Remote work trends may change education preferences',
          probability: 65,
          impact: 'Potential 15% reduction in program interest',
          mitigation: 'Develop online-first program messaging and flexible learning options'
        },
        {
          id: 'risk-2',
          type: 'competition',
          severity: 'high',
          description: 'Major competitor launching similar program with aggressive pricing',
          probability: 78,
          impact: 'Could reduce market share by 20-25%',
          mitigation: 'Emphasize unique value propositions and consider competitive pricing strategy'
        },
        {
          id: 'risk-3',
          type: 'demographic_change',
          severity: 'low',
          description: 'Generational shift in learning preferences',
          probability: 45,
          impact: 'Gradual decline in traditional program appeal',
          mitigation: 'Invest in modern learning technologies and delivery methods'
        }
      ],
      competitiveAnalysis: [
        {
          id: 'comp-1',
          competitor: 'University of Phoenix',
          targetingSimilarity: 73,
          differentiationOpportunity: 'Emphasize regional reputation and industry connections',
          marketShare: 18,
          recommendedStrategy: 'Focus on local market dominance and alumni network strength'
        },
        {
          id: 'comp-2',
          competitor: 'Southern New Hampshire University',
          targetingSimilarity: 68,
          differentiationOpportunity: 'Highlight specialized program tracks and faculty expertise',
          marketShare: 22,
          recommendedStrategy: 'Position as premium alternative with superior outcomes'
        },
        {
          id: 'comp-3',
          competitor: 'Arizona State University Online',
          targetingSimilarity: 81,
          differentiationOpportunity: 'Leverage smaller class sizes and personalized attention',
          marketShare: 15,
          recommendedStrategy: 'Emphasize quality over scale and personalized learning experience'
        }
      ]
    };

    return mockResult;
  };

  const getStepIcon = (step: ORDAEStep['step']) => {
    switch (step) {
      case 'observe':
        return <Eye className="w-4 h-4" />;
      case 'remember':
        return <Database className="w-4 h-4" />;
      case 'decide':
        return <Target className="w-4 h-4" />;
      case 'act':
        return <Play className="w-4 h-4" />;
      case 'evaluate':
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: ORDAEStep['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'processing':
        return 'text-blue-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-400';
    }
  };

  const getValidationStatusColor = (status: PersonaValidationResult['validationStatus']) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'needs_improvement':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: ValidationRecommendation['priority']) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-xl font-semibold">ORDAE Persona Validator</h3>
            <p className="text-sm text-muted-foreground">
              AI-powered validation for {personaName}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {result && (
            <Badge className={`${getValidationStatusColor(result.validationStatus)} border`}>
              Score: {result.overallScore}/100
            </Badge>
          )}
          <Button 
            onClick={startValidation} 
            disabled={isValidating}
            className="flex items-center space-x-2"
          >
            {isValidating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            <span>{isValidating ? 'Validating...' : 'Start Validation'}</span>
          </Button>
        </div>
      </div>

      {/* ORDAE Workflow Progress */}
      {isValidating && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-blue-600" />
              <span>ORDAE Validation Workflow</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.step} className={`flex items-center space-x-4 p-3 rounded-lg border ${
                index === currentStep ? 'bg-blue-50 border-blue-200' : 
                step.status === 'completed' ? 'bg-green-50 border-green-200' : 
                'bg-gray-50 border-gray-200'
              }`}>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step.status === 'completed' ? 'bg-green-100' :
                  step.status === 'processing' ? 'bg-blue-100' :
                  'bg-gray-100'
                }`}>
                  <div className={getStatusColor(step.status)}>
                    {getStepIcon(step.step)}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium capitalize">{step.step}</h4>
                    <span className="text-sm text-muted-foreground">{step.progress}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                  {step.progress > 0 && (
                    <Progress value={step.progress} className="h-2 mb-2" />
                  )}
                  {step.result && (
                    <p className="text-xs text-green-600 font-medium">{step.result}</p>
                  )}
                  {step.insights && step.insights.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {step.insights.map((insight, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-xs text-blue-600">
                          <Lightbulb className="w-3 h-3" />
                          <span>{insight}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Validation Results */}
      {result && (
        <div className="space-y-6">
          {/* Score Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{result.overallScore}/100</div>
                <Badge className={`mt-2 ${getValidationStatusColor(result.validationStatus)} border`}>
                  {result.validationStatus.replace('_', ' ').toUpperCase()}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Demographic Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{result.demographicAccuracy}%</div>
                <Progress value={result.demographicAccuracy} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Behavioral Alignment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{result.behavioralAlignment}%</div>
                <Progress value={result.behavioralAlignment} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Market Fit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{result.marketFit}%</div>
                <Progress value={result.marketFit} className="h-2 mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Detailed Results */}
          <Tabs defaultValue="recommendations" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="optimizations">Optimizations</TabsTrigger>
              <TabsTrigger value="risks">Risk Analysis</TabsTrigger>
              <TabsTrigger value="competitive">Competitive</TabsTrigger>
            </TabsList>

            <TabsContent value="recommendations" className="space-y-4">
              <div className="grid gap-4">
                {result.recommendations.map((rec) => (
                  <Card key={rec.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{rec.title}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge variant={getPriorityColor(rec.priority)}>
                            {rec.priority} priority
                          </Badge>
                          <Badge variant="outline">
                            {rec.confidence}% confidence
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-muted-foreground">{rec.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-green-600">Expected Impact</p>
                          <p>{rec.expectedImpact}</p>
                        </div>
                        <div>
                          <p className="font-medium text-blue-600">Implementation</p>
                          <p>{rec.implementation}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="optimizations" className="space-y-4">
              <div className="grid gap-4">
                {result.optimizations.map((opt) => (
                  <Card key={opt.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{opt.field}</CardTitle>
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          +{opt.improvementScore}% improvement
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Current</p>
                          <p className="text-red-600">{opt.currentValue}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Optimized</p>
                          <p className="text-green-600">{opt.optimizedValue}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Rationale</p>
                        <p className="text-sm">{opt.rationale}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Data Source</p>
                        <p className="text-xs text-blue-600">{opt.dataSource}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="risks" className="space-y-4">
              <div className="grid gap-4">
                {result.riskFactors.map((risk) => (
                  <Card key={risk.id} className={`border-l-4 ${
                    risk.severity === 'high' ? 'border-l-red-500' :
                    risk.severity === 'medium' ? 'border-l-yellow-500' :
                    'border-l-green-500'
                  }`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{risk.type.replace('_', ' ').toUpperCase()}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge variant={
                            risk.severity === 'high' ? 'destructive' :
                            risk.severity === 'medium' ? 'default' :
                            'secondary'
                          }>
                            {risk.severity} severity
                          </Badge>
                          <Badge variant="outline">
                            {risk.probability}% probability
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-muted-foreground">{risk.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-red-600">Potential Impact</p>
                          <p>{risk.impact}</p>
                        </div>
                        <div>
                          <p className="font-medium text-blue-600">Mitigation Strategy</p>
                          <p>{risk.mitigation}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="competitive" className="space-y-4">
              <div className="grid gap-4">
                {result.competitiveAnalysis.map((comp) => (
                  <Card key={comp.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{comp.competitor}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">
                            {comp.targetingSimilarity}% similarity
                          </Badge>
                          <Badge variant="secondary">
                            {comp.marketShare}% market share
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Differentiation Opportunity</p>
                        <p className="text-green-600">{comp.differentiationOpportunity}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Recommended Strategy</p>
                        <p>{comp.recommendedStrategy}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
