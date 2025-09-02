import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Users, 
  Database, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw,
  Zap,
  Brain
} from "lucide-react";
import { AIPersonaPromptDialog } from "./AIPersonaPromptDialog";
import { PersonaPreviewDialog } from "./PersonaPreviewDialog";
import { AIPersonaGenerator, PersonaGenerationRequest } from "../../services/ai/personaGenerator";
import { PersonaValidationService } from "../../services/personaValidation";
import { Persona } from "../../types/persona";

interface EnhancedBulkPersonaCreatorProps {
  selectedOrganization: string;
}

// Legacy MSU personas for backward compatibility
const MSU_PERSONAS = [
  {
    name: "Sarah Chen - Operations Manager",
    program_category: "Supply Chain Management",
    age_range: "32-42",
    occupation: "Operations Manager",
    income_range: "$65k-$95k",
    education_level: "Bachelor's in Business or Engineering",
    location: "Midwest manufacturing hubs",
    description: "Experienced operations manager seeking to advance to director level through strategic SCM expertise.",
    goals: ["advance_to_director_level", "master_supply_chain_analytics"],
    pain_points: ["supply_chain_disruptions", "lack_of_strategic_training"],
    preferred_channels: ["LinkedIn", "industry_publications"],
    personality_traits: ["analytical", "results_oriented", "strategic_thinking"],
    values: ["efficiency", "continuous_improvement", "data_driven_decisions"],
    status: "active"
  },
  {
    name: "Marcus Rodriguez - Procurement Specialist", 
    program_category: "Supply Chain Management",
    age_range: "28-38",
    occupation: "Senior Procurement Specialist",
    income_range: "$55k-$85k",
    education_level: "Bachelor's in Business",
    location: "Major metropolitan areas",
    description: "Senior procurement specialist seeking to become procurement manager through strategic sourcing mastery.",
    goals: ["become_procurement_manager", "master_strategic_sourcing"],
    pain_points: ["vendor_relationship_management", "cost_reduction_pressure"],
    preferred_channels: ["professional_associations", "LinkedIn"],
    personality_traits: ["detail_oriented", "cost_conscious", "relationship_focused"],
    values: ["savings", "efficiency", "partnership", "value"],
    status: "active"
  },
  {
    name: "Amanda Thompson - Team Leader",
    program_category: "Management and Leadership",
    age_range: "30-40",
    occupation: "Team Leader",
    income_range: "$60k-$90k",
    education_level: "Bachelor's degree",
    location: "Suburban areas",
    description: "Team leader seeking to advance to management through improved leadership skills.",
    goals: ["advance_to_management_role", "improve_leadership_skills"],
    pain_points: ["managing_difficult_team_members", "lack_of_formal_training"],
    preferred_channels: ["LinkedIn", "management_blogs"],
    personality_traits: ["supportive", "growth_oriented", "practical"],
    values: ["development", "empowerment", "results", "collaboration"],
    status: "active"
  },
  {
    name: "Rachel Foster - HR Generalist",
    program_category: "Human Capital Management",
    age_range: "28-38",
    occupation: "HR Generalist",
    income_range: "$50k-$75k",
    education_level: "Bachelor's in HR",
    location: "Metropolitan areas",
    description: "HR generalist seeking to advance through strategic HCM expertise.",
    goals: ["advance_to_hr_manager", "specialize_in_strategic_hr"],
    pain_points: ["limited_strategic_involvement", "need_for_advanced_skills"],
    preferred_channels: ["SHRM_resources", "LinkedIn"],
    personality_traits: ["people_focused", "strategic", "compliance_oriented"],
    values: ["employee_experience", "organizational_development", "compliance"],
    status: "active"
  }
];

export function EnhancedBulkPersonaCreator({ selectedOrganization }: EnhancedBulkPersonaCreatorProps) {
  const [activeTab, setActiveTab] = useState<'ai' | 'legacy'>('ai');
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentOperation, setCurrentOperation] = useState('');
  const [generatedPersonas, setGeneratedPersonas] = useState<Persona[]>([]);
  const [createdCount, setCreatedCount] = useState(0);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regeneratingIndex, setRegeneratingIndex] = useState(-1);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAIGeneration = async (request: PersonaGenerationRequest) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to generate personas",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setCurrentOperation('Initializing AI generation...');
    setProgress(10);

    try {
      setCurrentOperation('Generating personas with AI...');
      setProgress(30);

      const personas = await AIPersonaGenerator.generatePersonas(request);
      
      setCurrentOperation('Validating generated personas...');
      setProgress(70);

      // Validate and sanitize personas
      const validatedPersonas = personas.map(persona => {
        const validation = PersonaValidationService.validatePersonaData(persona);
        if (!validation.isValid) {
          console.warn('Generated persona has validation issues:', validation.errors);
        }
        return PersonaValidationService.sanitizePersonaData(persona);
      });

      setProgress(100);
      setGeneratedPersonas(validatedPersonas);
      setIsAIDialogOpen(false);
      setIsPreviewDialogOpen(true);

      toast({
        title: "Personas Generated!",
        description: `Successfully generated ${validatedPersonas.length} personas using AI`,
      });

    } catch (error) {
      console.error('AI generation failed:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate personas. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
      setProgress(0);
      setCurrentOperation('');
    }
  };

  const handleRegeneratePersona = async (index: number) => {
    if (!generatedPersonas[index] || isRegenerating) return;

    setIsRegenerating(true);
    setRegeneratingIndex(index);

    try {
      // This would regenerate a single persona - simplified for now
      toast({
        title: "Regenerating Persona",
        description: "This feature will be available in the next update",
      });
    } catch (error) {
      console.error('Regeneration failed:', error);
      toast({
        title: "Regeneration Failed",
        description: "Failed to regenerate persona. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRegenerating(false);
      setRegeneratingIndex(-1);
    }
  };

  const handleApprovePersonas = async (approvedPersonas: Persona[]) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save personas",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    setProgress(0);
    setCreatedCount(0);
    setCurrentOperation('Saving approved personas...');

    try {
      for (let i = 0; i < approvedPersonas.length; i++) {
        const persona = approvedPersonas[i];
        setCurrentOperation(`Saving ${persona.name}...`);
        
        const { error } = await supabase
          .from('personas')
          .insert({
            ...persona,
            user_id: user.id,
            organization_id: selectedOrganization,
            id: undefined, // Let database generate ID
            created_at: undefined, // Let database set timestamp
            updated_at: undefined
          });

        if (error) throw error;

        setCreatedCount(prev => prev + 1);
        setProgress(((i + 1) / approvedPersonas.length) * 100);

        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      setIsPreviewDialogOpen(false);
      setGeneratedPersonas([]);
      
      toast({
        title: "Personas Saved!",
        description: `Successfully saved ${approvedPersonas.length} AI-generated personas`,
      });

    } catch (error) {
      console.error('Error saving personas:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save some personas. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
      setProgress(0);
      setCurrentOperation('');
    }
  };

  const createLegacyPersonas = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create personas",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    setProgress(0);
    setCreatedCount(0);

    try {
      // Delete existing personas
      await supabase.from('personas').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      toast({
        title: "Cleanup Complete",
        description: "Existing personas have been removed"
      });

      // Create legacy personas
      for (let i = 0; i < MSU_PERSONAS.length; i++) {
        const persona = MSU_PERSONAS[i];
        setCurrentOperation(`Creating ${persona.name}...`);
        
        const { error } = await supabase
          .from('personas')
          .insert({
            ...persona,
            user_id: user.id,
            organization_id: selectedOrganization
          });

        if (error) throw error;

        setCreatedCount(prev => prev + 1);
        setProgress(((i + 1) / MSU_PERSONAS.length) * 100);

        await new Promise(resolve => setTimeout(resolve, 200));
      }

      toast({
        title: "Personas Created!",
        description: `Successfully created ${MSU_PERSONAS.length} MSU personas`,
      });

    } catch (error) {
      console.error('Error creating personas:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create some personas. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
      setProgress(0);
      setCurrentOperation('');
    }
  };

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Enhanced Persona Creator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'ai' | 'legacy')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ai" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                AI-Powered Generation
              </TabsTrigger>
              <TabsTrigger value="legacy" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Legacy MSU Personas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ai" className="space-y-6 mt-6">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">AI-Powered Persona Generation</h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Generate custom personas for any university program using natural language prompts. 
                    Our AI creates detailed, realistic personas based on your specific requirements.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  <Card className="bg-muted/30">
                    <CardContent className="p-4 text-center">
                      <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                      <h4 className="font-medium mb-1">Flexible Targeting</h4>
                      <p className="text-sm text-muted-foreground">
                        Generate personas for any university, program, or demographic
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/30">
                    <CardContent className="p-4 text-center">
                      <Brain className="h-8 w-8 text-primary mx-auto mb-2" />
                      <h4 className="font-medium mb-1">AI-Driven Quality</h4>
                      <p className="text-sm text-muted-foreground">
                        Intelligent generation with validation and quality scoring
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/30">
                    <CardContent className="p-4 text-center">
                      <CheckCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                      <h4 className="font-medium mb-1">Review & Approve</h4>
                      <p className="text-sm text-muted-foreground">
                        Preview, edit, and approve personas before saving
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Button 
                  size="lg" 
                  onClick={() => setIsAIDialogOpen(true)}
                  disabled={isGenerating || isCreating}
                  className="px-8"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate AI Personas
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="legacy" className="space-y-6 mt-6">
              <div className="text-muted-foreground">
                Create the original set of 12 MSU personas for testing and backward compatibility:
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Supply Chain Management (4 personas):</h4>
                    <p className="text-sm">Operations Manager, Procurement Specialist, Logistics Coordinator, Supply Chain Analyst</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Management and Leadership (4 personas):</h4>
                    <p className="text-sm">Team Leader, Project Manager, Department Supervisor, Emerging Leader</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Human Capital Management (4 personas):</h4>
                    <p className="text-sm">HR Generalist, Training Coordinator, Benefits Administrator, Talent Acquisition Specialist</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button 
                  onClick={createLegacyPersonas} 
                  disabled={isCreating || isGenerating}
                  size="lg"
                  variant="outline"
                  className="px-8"
                >
                  <Database className="h-4 w-4 mr-2" />
                  {isCreating ? 'Creating Personas...' : 'Create Legacy Personas'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Progress Display */}
          {(isGenerating || isCreating) && (
            <div className="space-y-4 bg-muted/30 p-4 rounded-lg mt-6">
              <div className="flex justify-between text-sm">
                <span>{isGenerating ? 'Generating personas...' : 'Creating personas...'}</span>
                {isCreating && (
                  <span className="font-medium">{createdCount}/{isGenerating ? generatedPersonas.length : MSU_PERSONAS.length}</span>
                )}
              </div>
              <Progress value={progress} className="h-3" />
              {currentOperation && (
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{currentOperation}</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Generation Dialog */}
      <AIPersonaPromptDialog
        isOpen={isAIDialogOpen}
        onOpenChange={setIsAIDialogOpen}
        onGenerate={handleAIGeneration}
        isGenerating={isGenerating}
      />

      {/* Persona Preview Dialog */}
      <PersonaPreviewDialog
        isOpen={isPreviewDialogOpen}
        onOpenChange={setIsPreviewDialogOpen}
        personas={generatedPersonas}
        onApprove={handleApprovePersonas}
        onRegenerate={handleRegeneratePersona}
        isRegenerating={isRegenerating}
        regeneratingIndex={regeneratingIndex}
      />
    </div>
  );
}
