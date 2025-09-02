import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Brain, Target, TrendingUp, Zap, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Persona } from "@/types/persona";
import { CampaignBlueprintService } from "@/services/campaignBlueprintService";
import { CampaignBlueprint } from "@/types/campaignBlueprint";

interface ORDAECampaignBuilderProps {
  persona: Persona;
  onStrategyGenerated: (strategy: CampaignStrategy) => void;
  onBlueprintGenerated?: (blueprint: CampaignBlueprint) => void;
}

interface CampaignStrategy {
  title: string;
  description: string;
  channels: string[];
  messagingVariants: string[];
  expectedMetrics: {
    cpl: number;
    ctr: number;
    conversionRate: number;
  };
  aiInsights: string[];
  personaTraits: string[];
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

export function ORDAECampaignBuilder({ persona, onStrategyGenerated, onBlueprintGenerated }: ORDAECampaignBuilderProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [strategy, setStrategy] = useState<CampaignStrategy | null>(null);
  const [blueprint, setBlueprint] = useState<CampaignBlueprint | null>(null);
  const { toast } = useToast();

  const ordaeSteps: ORDAEStep[] = [
    {
      id: 'observe',
      name: 'Observe',
      description: 'Analyzing persona data and market context',
      status: 'pending',
      icon: <Target className="w-4 h-4" />
    },
    {
      id: 'remember',
      name: 'Remember',
      description: 'Retrieving similar campaign insights from vector memory',
      status: 'pending',
      icon: <Brain className="w-4 h-4" />
    },
    {
      id: 'decide',
      name: 'Decide',
      description: 'Strategizing optimal campaign approach',
      status: 'pending',
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      id: 'act',
      name: 'Act',
      description: 'Generating campaign strategy and recommendations',
      status: 'pending',
      icon: <Zap className="w-4 h-4" />
    },
    {
      id: 'evaluate',
      name: 'Evaluate',
      description: 'Validating strategy and predicting performance',
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

  const simulateORDAEProcess = async () => {
    setIsProcessing(true);
    setCurrentStep(0);

    try {
      // Step 1: Observe
      updateStepStatus('observe', 'processing');
      await new Promise(resolve => setTimeout(resolve, 1500));
      const observeResult = {
        personaInsights: [
          `Target: ${persona.age_range} ${persona.occupation}`,
          `Industry: ${persona.industry}`,
          `Goals: ${persona.goals?.join(', ')}`,
          `Pain Points: ${persona.pain_points?.join(', ')}`
        ]
      };
      updateStepStatus('observe', 'completed', observeResult);
      setCurrentStep(1);

      // Step 2: Remember
      updateStepStatus('remember', 'processing');
      await new Promise(resolve => setTimeout(resolve, 2000));
      const rememberResult = {
        similarCampaigns: [
          'Similar persona campaigns achieved 15% higher CTR with emotional messaging',
          'LinkedIn performs 23% better for professional audiences',
          'Video content increases engagement by 34% for this demographic'
        ]
      };
      updateStepStatus('remember', 'completed', rememberResult);
      setCurrentStep(2);

      // Step 3: Decide
      updateStepStatus('decide', 'processing');
      await new Promise(resolve => setTimeout(resolve, 1800));
      const decideResult = {
        strategy: 'Multi-channel approach focusing on professional networks and emotional triggers',
        channels: ['LinkedIn', 'Email', 'Google'],
        messaging: 'Benefit-focused with social proof elements'
      };
      updateStepStatus('decide', 'completed', decideResult);
      setCurrentStep(3);

      // Step 4: Act - Generate both strategy and blueprint
      updateStepStatus('act', 'processing');
      await new Promise(resolve => setTimeout(resolve, 2200));
      
      // Generate campaign blueprint using GPT if configured (fallback to template)
      const generatedBlueprint = await CampaignBlueprintService.generateFromPersonaAI(persona, {
        id: `prog-${persona.program_category?.toLowerCase().replace(/\s+/g, '-') || 'general'}`,
        name: `${persona.name} Professional Development Program`,
        category: persona.program_category || 'Professional Development'
      });

      // Enhance blueprint with ORDAE insights
      generatedBlueprint.overview.why_now = `Based on ORDAE analysis: ${persona.name} professionals are experiencing increased demand for specialized skills in today's competitive market.`;
      generatedBlueprint.overview.desired_outcomes = [
        'Increase program enrollment by 25%',
        'Achieve 15% higher engagement rates',
        'Generate qualified leads for career advancement programs',
        'Build brand recognition in professional development space'
      ];

      // Add ORDAE-generated creative angles
      generatedBlueprint.creative_angles.ads = [
        {
          label: 'Career Acceleration',
          value_prop: 'Fast-track your professional growth',
          instructions: 'Focus on rapid career advancement and competitive advantage',
          example: `Ready to accelerate your ${persona.occupation} career? Join our proven development program.`
        },
        {
          label: 'Social Proof',
          value_prop: 'Join thousands of successful professionals',
          instructions: 'Leverage peer success and community validation',
          example: 'Join 10,000+ professionals who have advanced their careers through our program.'
        },
        {
          label: 'Emotional Appeal',
          value_prop: 'Unlock your full potential',
          instructions: 'Appeal to personal growth and self-actualization',
          example: 'Stop settling for less. Unlock your potential and transform your career today.'
        }
      ];

      // Generate traditional strategy for backward compatibility
      const generatedStrategy: CampaignStrategy = {
        title: generatedBlueprint.name,
        description: generatedBlueprint.overview.why_now,
        channels: ['LinkedIn', 'Email', 'Google Ads'],
        messagingVariants: generatedBlueprint.creative_angles.ads.map(ad => ad.example),
        expectedMetrics: {
          cpl: 85.50,
          ctr: 3.2,
          conversionRate: 12.8
        },
        aiInsights: [
          'Professional audiences respond 40% better to LinkedIn campaigns',
          'Email sequences with 3-touch cadence optimize conversion',
          'Career advancement messaging resonates with this persona segment'
        ],
        personaTraits: persona.personality_traits || [],
        recommendations: [
          'Use professional imagery and testimonials',
          'Implement progressive profiling in forms',
          'A/B test urgency vs. benefit-focused CTAs',
          'Schedule campaigns during business hours'
        ]
      };

      updateStepStatus('act', 'completed', { strategy: generatedStrategy, blueprint: generatedBlueprint });
      setCurrentStep(4);

      // Step 5: Evaluate
      updateStepStatus('evaluate', 'processing');
      await new Promise(resolve => setTimeout(resolve, 1500));
      const evaluateResult = {
        confidence: 87,
        riskFactors: ['Market seasonality', 'Competition intensity'],
        optimizations: ['Consider video testimonials', 'Add retargeting sequences']
      };
      updateStepStatus('evaluate', 'completed', evaluateResult);

      setStrategy(generatedStrategy);
      setBlueprint(generatedBlueprint);
      
      // Save blueprint to storage
      await CampaignBlueprintService.saveBlueprint(generatedBlueprint);
      
      onStrategyGenerated(generatedStrategy);
      if (onBlueprintGenerated) {
        onBlueprintGenerated(generatedBlueprint);
      }

      toast({
        title: "Campaign Blueprint Generated",
        description: "ORDAE agents have created a comprehensive campaign blueprint following the 4-phase framework.",
      });

    } catch (error) {
      console.error('ORDAE process error:', error);
      toast({
        title: "Strategy Generation Failed",
        description: "There was an error generating the campaign strategy. Please try again.",
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            ORDAE Campaign Strategy Generator
          </CardTitle>
          <CardDescription>
            AI-powered campaign strategy using Observe → Remember → Decide → Act → Evaluate workflow
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isProcessing && !strategy && (
            <Button onClick={simulateORDAEProcess} className="w-full">
              <Brain className="w-4 h-4 mr-2" />
              Generate AI Campaign Strategy
            </Button>
          )}

          {isProcessing && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Processing ORDAE Workflow</span>
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

          {strategy && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Strategy Generated Successfully!</h3>
                <p className="text-sm text-green-700">
                  ORDAE agents have analyzed your persona and generated an optimized campaign strategy.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Campaign Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-1">Title</h4>
                      <p className="text-sm text-muted-foreground">{strategy.title}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Description</h4>
                      <p className="text-sm text-muted-foreground">{strategy.description}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Recommended Channels</h4>
                      <div className="flex flex-wrap gap-1">
                        {strategy.channels.map((channel, index) => (
                          <Badge key={index} variant="secondary">{channel}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Predicted Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">${strategy.expectedMetrics.cpl}</div>
                        <div className="text-xs text-muted-foreground">Expected CPL</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{strategy.expectedMetrics.ctr}%</div>
                        <div className="text-xs text-muted-foreground">Expected CTR</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">{strategy.expectedMetrics.conversionRate}%</div>
                        <div className="text-xs text-muted-foreground">Conversion Rate</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">AI Insights & Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Key Insights</h4>
                    <ul className="space-y-1">
                      {strategy.aiInsights.map((insight, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Recommendations</h4>
                    <ul className="space-y-1">
                      {strategy.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Messaging Variants</h4>
                    <div className="space-y-2">
                      {strategy.messagingVariants.map((variant, index) => (
                        <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                          {variant}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
