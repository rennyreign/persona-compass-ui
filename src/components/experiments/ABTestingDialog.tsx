import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { FlaskConical, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Persona } from "@/types/persona";

interface ABTestFormData {
  personaId: string;
  name: string;
  description: string;
  hypothesis: string;
  variantADescription: string;
  variantBDescription: string;
  testMetric: string;
  sampleSizeTarget: number;
  confidenceLevel: number;
}

interface ABTestingDialogProps {
  trigger?: React.ReactNode;
  onExperimentCreated?: (experiment: any) => void;
}

const testMetrics = [
  { value: 'cpl', label: 'Cost Per Lead (CPL)' },
  { value: 'ctr', label: 'Click-Through Rate (CTR)' },
  { value: 'conversion_rate', label: 'Conversion Rate' },
  { value: 'cpc', label: 'Cost Per Click (CPC)' },
  { value: 'roas', label: 'Return on Ad Spend (ROAS)' },
];

const confidenceLevels = [
  { value: 0.90, label: '90%' },
  { value: 0.95, label: '95%' },
  { value: 0.99, label: '99%' },
];

export function ABTestingDialog({ trigger, onExperimentCreated }: ABTestingDialogProps) {
  const [open, setOpen] = useState(false);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ABTestFormData>({
    defaultValues: {
      personaId: "",
      name: "",
      description: "",
      hypothesis: "",
      variantADescription: "",
      variantBDescription: "",
      testMetric: "cpl",
      sampleSizeTarget: 1000,
      confidenceLevel: 0.95,
    },
  });

  useEffect(() => {
    fetchPersonas();
  }, []);

  const fetchPersonas = async () => {
    const { data, error } = await supabase
      .from('personas')
      .select('*')
      .eq('status', 'active');
    
    if (error) {
      console.error('Error fetching personas:', error);
      return;
    }
    
    setPersonas(data || []);
  };

  const onSubmit = async (data: ABTestFormData) => {
    setLoading(true);
    
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        toast({
          title: "Authentication required",
          description: "Please log in to create A/B tests.",
          variant: "destructive",
        });
        return;
      }

      // Create A/B test experiment
      const { data: experiment, error } = await supabase
        .from('ab_experiments')
        .insert({
          user_id: user.user.id,
          persona_id: data.personaId,
          name: data.name,
          description: data.description,
          hypothesis: data.hypothesis,
          variant_a_description: data.variantADescription,
          variant_b_description: data.variantBDescription,
          test_metric: data.testMetric,
          sample_size_target: data.sampleSizeTarget,
          confidence_level: data.confidenceLevel,
          status: 'draft',
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "A/B Test Created",
        description: `Experiment "${data.name}" has been created successfully.`,
      });

      onExperimentCreated?.(experiment);
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error creating A/B test:', error);
      toast({
        title: "Error",
        description: "Failed to create A/B test. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <FlaskConical className="w-4 h-4 mr-2" />
            Create A/B Test
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5" />
            Create A/B Test Experiment
          </DialogTitle>
          <DialogDescription>
            Set up a controlled experiment to test different approaches for your persona
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Experiment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="personaId"
                rules={{ required: "Please select a persona" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Persona *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select persona" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {personas.map((persona) => (
                          <SelectItem key={persona.id} value={persona.id}>
                            {persona.name} - {persona.program_category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="testMetric"
                rules={{ required: "Please select a test metric" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Metric *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select metric to optimize" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {testMetrics.map((metric) => (
                          <SelectItem key={metric.value} value={metric.value}>
                            {metric.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="name"
              rules={{ required: "Experiment name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experiment Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Email Subject Line Test" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hypothesis"
              rules={{ required: "Hypothesis is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hypothesis *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="e.g., Benefit-focused headlines will outperform feature-focused headlines for this persona because they prioritize outcomes over technical details"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    What do you expect to happen and why?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Optional: Additional context about the experiment"
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Variant Definitions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Test Variants</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="variantADescription"
                  rules={{ required: "Variant A description is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Badge variant="outline">A</Badge>
                        Control Variant *
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the control/current approach"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="variantBDescription"
                  rules={{ required: "Variant B description is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Badge variant="default">B</Badge>
                        Test Variant *
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the new approach being tested"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Test Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sampleSizeTarget"
                rules={{ required: "Sample size is required", min: { value: 100, message: "Minimum 100 required" } }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sample Size Target *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="1000" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Total number of interactions needed for statistical significance
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confidenceLevel"
                rules={{ required: "Confidence level is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confidence Level *</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseFloat(value))} defaultValue={field.value.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {confidenceLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value.toString()}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Statistical confidence threshold for declaring a winner
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={loading}>
            {loading ? "Creating..." : "Create Experiment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}