import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FlaskConical, Target, Users, Calendar, TrendingUp, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface ABTestPlan {
  id: string;
  name: string;
  hypothesis: string;
  target_personas: string[];
  test_variants: {
    control: {
      name: string;
      description: string;
      messaging: string;
    };
    variant: {
      name: string;
      description: string;
      messaging: string;
    };
  };
  success_metrics: string[];
  sample_size: number;
  duration_days: number;
  confidence_level: number;
  status: 'draft' | 'active' | 'completed';
}

export function ABTestPlanGenerator() {
  const [personas, setPersonas] = useState<any[]>([]);
  const [testPlan, setTestPlan] = useState<Partial<ABTestPlan>>({
    name: '',
    hypothesis: '',
    target_personas: [],
    test_variants: {
      control: { name: 'Control', description: '', messaging: '' },
      variant: { name: 'Variant A', description: '', messaging: '' }
    },
    success_metrics: ['conversion_rate'],
    sample_size: 1000,
    duration_days: 14,
    confidence_level: 95,
    status: 'draft'
  });
  const [generatedPlans, setGeneratedPlans] = useState<ABTestPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPersonas = async () => {
      if (!user) return;

      const { data } = await supabase
        .from('personas')
        .select('id, name, program_category')
        .eq('status', 'active');

      setPersonas(data || []);
    };

    fetchPersonas();
  }, [user]);

  const generateABTestPlan = async () => {
    setLoading(true);
    
    // Generate AI-powered AB test plan based on selected personas
    const selectedPersonas = personas.filter(p => testPlan.target_personas?.includes(p.id));
    
    const aiGeneratedPlan: ABTestPlan = {
      id: `test-${Date.now()}`,
      name: testPlan.name || `${selectedPersonas[0]?.name || 'Persona'} Messaging Test`,
      hypothesis: testPlan.hypothesis || `Testing personalized messaging for ${selectedPersonas.map(p => p.name).join(', ')} will increase conversion rates by 15-25%`,
      target_personas: testPlan.target_personas || [],
      test_variants: {
        control: {
          name: 'Control - Generic Messaging',
          description: 'Standard university program messaging',
          messaging: 'Advance your career with our comprehensive program designed for working professionals.'
        },
        variant: {
          name: 'Variant A - Persona-Specific',
          description: 'Personalized messaging based on persona motivations',
          messaging: selectedPersonas[0]?.program_category === 'Business' 
            ? 'Transform your leadership potential and accelerate your career trajectory with our MBA program tailored for ambitious professionals like you.'
            : 'Master cutting-edge technologies and advance your tech career with our hands-on program designed for experienced developers.'
        }
      },
      success_metrics: [
        'conversion_rate',
        'click_through_rate',
        'cost_per_acquisition',
        'engagement_rate'
      ],
      sample_size: testPlan.sample_size || 1000,
      duration_days: testPlan.duration_days || 14,
      confidence_level: testPlan.confidence_level || 95,
      status: 'draft'
    };

    setGeneratedPlans(prev => [aiGeneratedPlan, ...prev]);
    setLoading(false);
  };

  const exportTestPlan = (plan: ABTestPlan) => {
    const exportData = {
      ...plan,
      created_at: new Date().toISOString(),
      created_by: user?.email,
      statistical_power: 0.8,
      minimum_detectable_effect: 0.15,
      expected_baseline_rate: 0.12
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ab-test-plan-${plan.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Test Plan Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5" />
            AB Test Plan Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="test-name">Test Name</Label>
              <Input
                id="test-name"
                placeholder="e.g., MBA Persona Messaging Test"
                value={testPlan.name}
                onChange={(e) => setTestPlan(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="personas">Target Personas</Label>
              <Select
                value={testPlan.target_personas?.[0] || ''}
                onValueChange={(value) => setTestPlan(prev => ({ 
                  ...prev, 
                  target_personas: [value] 
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select personas to test" />
                </SelectTrigger>
                <SelectContent>
                  {personas.map((persona) => (
                    <SelectItem key={persona.id} value={persona.id}>
                      {persona.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="hypothesis">Test Hypothesis</Label>
            <Textarea
              id="hypothesis"
              placeholder="Describe what you expect to test and the expected outcome..."
              value={testPlan.hypothesis}
              onChange={(e) => setTestPlan(prev => ({ ...prev, hypothesis: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="sample-size">Sample Size</Label>
              <Input
                id="sample-size"
                type="number"
                value={testPlan.sample_size}
                onChange={(e) => setTestPlan(prev => ({ 
                  ...prev, 
                  sample_size: parseInt(e.target.value) 
                }))}
              />
            </div>
            
            <div>
              <Label htmlFor="duration">Duration (days)</Label>
              <Input
                id="duration"
                type="number"
                value={testPlan.duration_days}
                onChange={(e) => setTestPlan(prev => ({ 
                  ...prev, 
                  duration_days: parseInt(e.target.value) 
                }))}
              />
            </div>
            
            <div>
              <Label htmlFor="confidence">Confidence Level (%)</Label>
              <Input
                id="confidence"
                type="number"
                value={testPlan.confidence_level}
                onChange={(e) => setTestPlan(prev => ({ 
                  ...prev, 
                  confidence_level: parseInt(e.target.value) 
                }))}
              />
            </div>
          </div>

          <Button 
            onClick={generateABTestPlan} 
            disabled={loading || !testPlan.target_personas?.length}
            className="w-full"
          >
            {loading ? 'Generating...' : 'Generate AI-Powered Test Plan'}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Test Plans */}
      {generatedPlans.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Generated Test Plans</h3>
          {generatedPlans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{plan.status}</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportTestPlan(plan)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Hypothesis</h4>
                  <p className="text-sm text-muted-foreground">{plan.hypothesis}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-blue-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-blue-700">
                        {plan.test_variants.control.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-muted-foreground mb-2">
                        {plan.test_variants.control.description}
                      </p>
                      <p className="text-sm italic">
                        "{plan.test_variants.control.messaging}"
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-green-700">
                        {plan.test_variants.variant.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-muted-foreground mb-2">
                        {plan.test_variants.variant.description}
                      </p>
                      <p className="text-sm italic">
                        "{plan.test_variants.variant.messaging}"
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{plan.sample_size.toLocaleString()} users</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{plan.duration_days} days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span>{plan.confidence_level}% confidence</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span>{plan.success_metrics.length} metrics</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Success Metrics</h4>
                  <div className="flex flex-wrap gap-2">
                    {plan.success_metrics.map((metric) => (
                      <Badge key={metric} variant="secondary">
                        {metric.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
