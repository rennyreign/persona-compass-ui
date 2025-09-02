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
import { Plus, Target, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Persona } from "@/types/persona";
import { ORDAECampaignBuilder } from "./ORDAECampaignBuilder";

interface EnhancedCreateCampaignFormData {
  personaId: string;
  name: string;
  channel: string;
  cta: string;
  startDate: string;
  markdownContent: string;
  personaTraitsTested: string[];
  messagingVariant: string;
  expectedCpl: number;
  expectedCtr: number;
  experimentId?: string;
  experimentVariant?: string;
}

interface EnhancedCreateCampaignDialogProps {
  trigger?: React.ReactNode;
  onCampaignCreated?: (campaign: any) => void;
}

const channels = [
  "Facebook", "Instagram", "LinkedIn", "TikTok", "Google", 
  "YouTube", "Twitter", "Email", "Direct Mail", "Radio"
];

const messagingVariants = [
  "Benefit-focused", "Feature-focused", "Emotional", "Rational", 
  "Urgency-driven", "Social proof", "Authority-based", "Problem-solving"
];

export function EnhancedCreateCampaignDialog({ trigger, onCampaignCreated }: EnhancedCreateCampaignDialogProps) {
  const [open, setOpen] = useState(false);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [loading, setLoading] = useState(false);
  const [showORDAE, setShowORDAE] = useState(false);
  const [aiStrategy, setAIStrategy] = useState<any>(null);
  const { toast } = useToast();
  
  const form = useForm<EnhancedCreateCampaignFormData>({
    defaultValues: {
      personaId: "",
      name: "",
      channel: "",
      cta: "",
      startDate: "",
      markdownContent: "",
      personaTraitsTested: [],
      messagingVariant: "",
      expectedCpl: 0,
      expectedCtr: 0,
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
    
    // Filter personas that have sufficient data for campaigns
    const validPersonas = (data || []).filter(persona => 
      validatePersonaForCampaign(persona)
    );
    
    setPersonas(validPersonas);
  };

  const validatePersonaForCampaign = (persona: Persona) => {
    // Check if persona has minimum required fields
    const hasBasicInfo = persona.name && persona.description;
    const hasTargetingData = persona.age_range || persona.occupation || persona.industry;
    const hasChannelData = persona.preferred_channels && persona.preferred_channels.length > 0;
    
    return hasBasicInfo && hasTargetingData && hasChannelData;
  };

  const onSubmit = async (data: EnhancedCreateCampaignFormData) => {
    setLoading(true);
    
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        toast({
          title: "Authentication required",
          description: "Please log in to create campaigns.",
          variant: "destructive",
        });
        return;
      }

      // Create campaign with enhanced attribution fields
      const { data: campaign, error } = await supabase
        .from('campaigns')
        .insert({
          user_id: user.user.id,
          persona_id: data.personaId,
          title: data.name,
          description: data.markdownContent,
          channels: [data.channel],
          status: 'draft',
          start_date: data.startDate,
          persona_traits_tested: data.personaTraitsTested,
          messaging_variant: data.messagingVariant,
          expected_cpl: data.expectedCpl,
          expected_ctr: data.expectedCtr,
          experiment_id: data.experimentId,
          experiment_variant: data.experimentVariant,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Campaign Created",
        description: `Campaign "${data.name}" has been created with enhanced tracking.`,
      });

      onCampaignCreated?.(campaign);
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePersonaSelect = (personaId: string) => {
    const persona = personas.find(p => p.id === personaId);
    setSelectedPersona(persona || null);
    
    if (persona) {
      // Auto-suggest traits to test based on persona data
      const suggestedTraits = [
        ...(persona.personality_traits || []),
        ...(persona.values || []),
        ...(persona.goals || [])
      ].slice(0, 3);
      
      form.setValue('personaTraitsTested', suggestedTraits);
      
      // Show ORDAE option for personas with sufficient data
      if (validatePersonaForCampaign(persona)) {
        setShowORDAE(true);
      }
    }
  };

  const handleAIStrategyGenerated = (strategy: any) => {
    setAIStrategy(strategy);
    
    // Auto-populate form with AI-generated strategy
    form.setValue('name', strategy.title);
    form.setValue('markdownContent', strategy.description);
    form.setValue('expectedCpl', strategy.expectedMetrics.cpl);
    form.setValue('expectedCtr', strategy.expectedMetrics.ctr);
    form.setValue('messagingVariant', strategy.messagingVariants[0]?.split(':')[0] || 'Benefit-focused');
    
    if (strategy.channels.length > 0) {
      form.setValue('channel', strategy.channels[0]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Create AI-Enhanced Campaign
          </DialogTitle>
          <DialogDescription>
            Create campaigns with ORDAE AI strategy generation and enhanced attribution tracking
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Campaign Form */}
          <div className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Campaign Info */}
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="personaId"
                    rules={{ required: "Please select a persona" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Persona *</FormLabel>
                        <Select onValueChange={(value) => {
                          field.onChange(value);
                          handlePersonaSelect(value);
                        }} defaultValue={field.value}>
                           <FormControl>
                             <SelectTrigger className="bg-white border-border text-foreground">
                               <SelectValue placeholder="Select persona" />
                             </SelectTrigger>
                           </FormControl>
                          <SelectContent>
                            {personas.length === 0 ? (
                              <SelectItem value="" disabled>
                                No valid personas available. Create personas with complete targeting data.
                              </SelectItem>
                            ) : (
                              personas.map((persona) => (
                                <SelectItem key={persona.id} value={persona.id}>
                                  {persona.name} - {persona.program_category}
                                  <div className="text-xs text-muted-foreground ml-2">
                                    {persona.preferred_channels?.join(', ')}
                                  </div>
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="channel"
                    rules={{ required: "Please select a channel" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marketing Channel *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                           <FormControl>
                             <SelectTrigger className="bg-white border-border text-foreground">
                               <SelectValue placeholder="Select channel" />
                             </SelectTrigger>
                           </FormControl>
                          <SelectContent>
                            {channels.map((channel) => (
                              <SelectItem key={channel} value={channel}>
                                {channel}
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
                  rules={{ required: "Campaign name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Name *</FormLabel>
                       <FormControl>
                         <Input placeholder="Enter campaign name" className="bg-white border-border text-foreground" {...field} />
                       </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Attribution Tracking Section */}
                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Attribution Tracking
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="messagingVariant"
                      rules={{ required: "Please select a messaging variant" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Messaging Variant *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                             <FormControl>
                               <SelectTrigger className="bg-white border-border text-foreground">
                                 <SelectValue placeholder="Select messaging approach" />
                               </SelectTrigger>
                             </FormControl>
                            <SelectContent>
                              {messagingVariants.map((variant) => (
                                <SelectItem key={variant} value={variant}>
                                  {variant}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            This helps track which messaging approaches work best for this persona
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cta"
                      rules={{ required: "Call-to-action is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Call-to-Action *</FormLabel>
                           <FormControl>
                             <Input placeholder="e.g., Sign up for free trial" className="bg-white border-border text-foreground" {...field} />
                           </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Performance Predictions */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="expectedCpl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expected CPL ($)</FormLabel>
                           <FormControl>
                             <Input 
                               type="number" 
                               step="0.01" 
                               placeholder="e.g., 75.00" 
                               className="bg-white border-border text-foreground"
                               {...field}
                               onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                             />
                           </FormControl>
                          <FormDescription>
                            Predicted cost per lead
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="expectedCtr"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expected CTR (%)</FormLabel>
                           <FormControl>
                             <Input 
                               type="number" 
                               step="0.1" 
                               placeholder="e.g., 2.5" 
                               className="bg-white border-border text-foreground"
                               {...field}
                               onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                             />
                           </FormControl>
                          <FormDescription>
                            Predicted click-through rate
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="startDate"
                      rules={{ required: "Start date is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date *</FormLabel>
                           <FormControl>
                             <Input type="date" className="bg-white border-border text-foreground" {...field} />
                           </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Persona Traits Being Tested */}
                  {selectedPersona && (
                    <div className="space-y-2">
                      <FormLabel>Persona Traits Being Tested</FormLabel>
                      <div className="flex flex-wrap gap-2">
                        {form.watch('personaTraitsTested').map((trait, index) => (
                          <Badge key={index} variant="secondary">
                            {trait}
                          </Badge>
                        ))}
                      </div>
                      <FormDescription>
                        These traits will be tracked to see which drive the best performance
                      </FormDescription>
                    </div>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="markdownContent"
                  rules={{ required: "Campaign content is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Plan Content *</FormLabel>
                       <FormControl>
                         <Textarea
                           placeholder="Paste your campaign markdown content here or type directly..."
                           className="min-h-[200px] font-mono bg-white border-border text-foreground"
                           {...field}
                         />
                       </FormControl>
                      <FormDescription>
                        Import your campaign plan markdown or create content directly in this editor
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>

          {/* Right Column - ORDAE AI Strategy Generator */}
          <div className="space-y-6">
            {selectedPersona && showORDAE && (
              <ORDAECampaignBuilder
                persona={selectedPersona}
                onStrategyGenerated={handleAIStrategyGenerated}
              />
            )}

            {!selectedPersona && (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <Target className="w-12 h-12 mx-auto" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Choose a target persona to generate AI-optimized campaign strategies using ORDAE agents
                </p>
              </div>
            )}

            {aiStrategy && (
              <div className="border-green-200 bg-green-50">
                <div className="pb-3">
                  <div className="text-lg text-green-800">AI Strategy Applied</div>
                  <div className="text-green-700">
                    Campaign form has been populated with AI-generated strategy
                  </div>
                </div>
                <div>
                  <div className="space-y-2 text-sm">
                    <div><strong>Strategy:</strong> {aiStrategy.title}</div>
                    <div><strong>Channels:</strong> {aiStrategy.channels.join(', ')}</div>
                    <div><strong>Expected CPL:</strong> ${aiStrategy.expectedMetrics.cpl}</div>
                    <div><strong>Expected CTR:</strong> {aiStrategy.expectedMetrics.ctr}%</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={loading}>
            {loading ? "Creating..." : "Create Campaign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}