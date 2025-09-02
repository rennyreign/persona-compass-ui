import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Target } from "lucide-react";
import { CampaignBlueprintService } from "@/services/campaignBlueprintService";
import { CampaignBlueprint } from "@/types/campaignBlueprint";

interface PersonaData {
  id: string;
  name: string;
  program_category: string;
  occupation: string;
  goals: string[];
  pain_points: string[];
}

interface BulkCampaignCreatorProps {
  selectedOrganization: string;
}

const MSU_CAMPAIGN_TEMPLATES = {
  "Supply Chain Management": {
    "Operations Manager": {
      title: "Strategic SCM Leadership Program",
      description: "Advance your operations management career with strategic supply chain expertise and analytics mastery.",
      campaign_type: "awareness",
      objectives: ["increase_enrollment", "build_brand_awareness", "generate_leads"],
      target_metrics: ["enrollment_rate", "lead_generation", "engagement_rate"],
      channels: ["LinkedIn", "industry_publications", "professional_associations"],
      budget: 15000,
      creative_assets: ["professional_video", "case_studies", "infographics"]
    },
    "Procurement Specialist": {
      title: "Master Strategic Sourcing & Procurement",
      description: "Transform your procurement career with advanced strategic sourcing and vendor management skills.",
      campaign_type: "conversion",
      objectives: ["increase_enrollment", "generate_qualified_leads"],
      target_metrics: ["conversion_rate", "cost_per_lead", "enrollment_rate"],
      channels: ["LinkedIn", "procurement_forums", "industry_events"],
      budget: 12000,
      creative_assets: ["success_stories", "roi_calculator", "webinar_series"]
    },
    "Logistics Coordinator": {
      title: "Transportation & Logistics Excellence",
      description: "Advance to logistics management through transportation optimization and supply chain analytics.",
      campaign_type: "awareness",
      objectives: ["build_brand_awareness", "generate_leads", "increase_engagement"],
      target_metrics: ["reach", "engagement_rate", "lead_quality"],
      channels: ["logistics_publications", "LinkedIn", "transportation_forums"],
      budget: 10000,
      creative_assets: ["interactive_demos", "career_progression_guide", "industry_insights"]
    },
    "Supply Chain Analyst": {
      title: "AI-Powered Supply Chain Analytics",
      description: "Master next-generation supply chain analytics and AI/ML applications for career advancement.",
      campaign_type: "conversion",
      objectives: ["increase_enrollment", "generate_qualified_leads"],
      target_metrics: ["enrollment_rate", "lead_conversion", "engagement_depth"],
      channels: ["analytics_communities", "LinkedIn", "tech_publications"],
      budget: 13000,
      creative_assets: ["ai_demo_videos", "data_visualization_examples", "career_roadmap"]
    }
  },
  "Management and Leadership": {
    "Team Leader": {
      title: "Leadership Development Accelerator",
      description: "Transform from team leader to strategic manager with proven leadership methodologies.",
      campaign_type: "awareness",
      objectives: ["build_brand_awareness", "generate_leads", "increase_engagement"],
      target_metrics: ["reach", "engagement_rate", "lead_generation"],
      channels: ["LinkedIn", "management_blogs", "leadership_forums"],
      budget: 11000,
      creative_assets: ["leadership_assessment", "success_stories", "management_toolkit"]
    },
    "Project Manager": {
      title: "Strategic Project Leadership Program",
      description: "Advance to senior PM roles with enhanced stakeholder management and strategic leadership skills.",
      campaign_type: "conversion",
      objectives: ["increase_enrollment", "generate_qualified_leads"],
      target_metrics: ["conversion_rate", "enrollment_rate", "lead_quality"],
      channels: ["project_management_communities", "LinkedIn", "PMI_network"],
      budget: 14000,
      creative_assets: ["pm_certification_guide", "stakeholder_templates", "career_advancement_plan"]
    },
    "Department Supervisor": {
      title: "Management Excellence Program",
      description: "Advance your supervisory career with formal leadership training and employee engagement strategies.",
      campaign_type: "awareness",
      objectives: ["build_brand_awareness", "generate_leads", "increase_engagement"],
      target_metrics: ["reach", "engagement_rate", "lead_generation"],
      channels: ["industry_associations", "LinkedIn", "management_publications"],
      budget: 9000,
      creative_assets: ["employee_engagement_guide", "management_best_practices", "roi_case_studies"]
    },
    "Emerging Leader": {
      title: "Future Leaders Development Track",
      description: "Fast-track your transition from individual contributor to management with comprehensive leadership training.",
      campaign_type: "conversion",
      objectives: ["increase_enrollment", "generate_qualified_leads", "build_pipeline"],
      target_metrics: ["enrollment_rate", "lead_conversion", "program_completion"],
      channels: ["LinkedIn", "career_development_sites", "young_professionals_groups"],
      budget: 12000,
      creative_assets: ["leadership_readiness_assessment", "mentorship_program_info", "career_transition_guide"]
    }
  },
  "Human Capital Management": {
    "HR Generalist": {
      title: "Strategic HCM Leadership Program",
      description: "Advance to HR management with strategic human capital expertise and organizational development skills.",
      campaign_type: "awareness",
      objectives: ["build_brand_awareness", "generate_leads", "increase_engagement"],
      target_metrics: ["reach", "engagement_rate", "lead_generation"],
      channels: ["SHRM_resources", "LinkedIn", "hr_publications"],
      budget: 13000,
      creative_assets: ["strategic_hr_toolkit", "organizational_development_guide", "career_progression_map"]
    },
    "Training Coordinator": {
      title: "Learning & Development Mastery",
      description: "Advance to L&D management through instructional design expertise and training effectiveness measurement.",
      campaign_type: "conversion",
      objectives: ["increase_enrollment", "generate_qualified_leads"],
      target_metrics: ["conversion_rate", "enrollment_rate", "program_engagement"],
      channels: ["training_publications", "LinkedIn", "atd_network"],
      budget: 10000,
      creative_assets: ["instructional_design_templates", "roi_measurement_tools", "learning_analytics_demo"]
    },
    "Benefits Administrator": {
      title: "Total Rewards Strategy Program",
      description: "Advance to compensation management through strategic total rewards expertise and regulatory mastery.",
      campaign_type: "awareness",
      objectives: ["build_brand_awareness", "generate_leads", "establish_expertise"],
      target_metrics: ["reach", "engagement_rate", "thought_leadership"],
      channels: ["benefits_publications", "LinkedIn", "worldatwork_network"],
      budget: 8000,
      creative_assets: ["total_rewards_calculator", "compliance_checklist", "benefits_optimization_guide"]
    },
    "Talent Acquisition Specialist": {
      title: "Strategic Recruiting Excellence",
      description: "Advance to senior recruiting roles through strategic talent acquisition and candidate experience optimization.",
      campaign_type: "conversion",
      objectives: ["increase_enrollment", "generate_qualified_leads"],
      target_metrics: ["conversion_rate", "enrollment_rate", "lead_quality"],
      channels: ["recruiting_communities", "LinkedIn", "shrm_talent"],
      budget: 11000,
      creative_assets: ["recruiting_strategy_playbook", "candidate_experience_audit", "diversity_recruiting_guide"]
    }
  }
};

export function BulkCampaignCreator({ selectedOrganization }: BulkCampaignCreatorProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentPersona, setCurrentPersona] = useState('');
  const [personas, setPersonas] = useState<PersonaData[]>([]);
  const [createdCount, setCreatedCount] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadPersonas = async () => {
    if (!user) return;

    try {
      console.log('BulkCampaignCreator: Loading personas for organization:', selectedOrganization);
      
      // First, let's see ALL personas and their organization_id values
      const { data: allPersonas, error: allError } = await supabase
        .from('personas')
        .select('id, name, program_category, occupation, goals, pain_points, organization_id');

      if (allError) throw allError;
      
      console.log('BulkCampaignCreator: ALL personas in database:', allPersonas?.length || 0);
      console.log('BulkCampaignCreator: Sample personas with org_id:', allPersonas?.slice(0, 3));
      
      // If personas don't have organization_id set, update them
      const personasWithoutOrgId = allPersonas?.filter(p => !p.organization_id) || [];
      if (personasWithoutOrgId.length > 0) {
        console.log('BulkCampaignCreator: Found', personasWithoutOrgId.length, 'personas without organization_id, updating...');
        
        const { error: updateError } = await supabase
          .from('personas')
          .update({ organization_id: selectedOrganization })
          .in('id', personasWithoutOrgId.map(p => p.id));
          
        if (updateError) {
          console.error('Error updating personas organization_id:', updateError);
        } else {
          console.log('BulkCampaignCreator: Successfully updated personas with organization_id');
        }
      }

      // Now get personas for the selected organization
      let query = supabase
        .from('personas')
        .select('id, name, program_category, occupation, goals, pain_points, organization_id');

      if (selectedOrganization) {
        query = query.eq('organization_id', selectedOrganization);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      console.log('BulkCampaignCreator: Final loaded personas:', data?.length || 0);
      setPersonas(data || []);
    } catch (error) {
      console.error('Error loading personas:', error);
      toast({
        title: "Error",
        description: "Failed to load personas",
        variant: "destructive"
      });
    }
  };

  React.useEffect(() => {
    loadPersonas();
  }, [user]);

  const generateBlueprintForPersona = async (persona: PersonaData): Promise<CampaignBlueprint | null> => {
    // Find program context from templates
    const programTemplates = MSU_CAMPAIGN_TEMPLATES[persona.program_category as keyof typeof MSU_CAMPAIGN_TEMPLATES];
    if (!programTemplates) return null;

    const occupationKey = Object.keys(programTemplates).find(key => 
      persona.occupation?.toLowerCase().includes(key.toLowerCase()) ||
      key.toLowerCase().includes(persona.occupation?.toLowerCase() || '')
    );

    if (!occupationKey) return null;

    const template = (programTemplates as any)[occupationKey];
    
    // Create program context object
    const programContext = {
      id: `prog-${persona.program_category.toLowerCase().replace(/\s+/g, '-')}`,
      name: template.title,
      category: persona.program_category
    };

    // Generate blueprint using the service
    const blueprint = await CampaignBlueprintService.generateFromPersonaAI(persona, programContext);
    
    // Enhance with template-specific data
    blueprint.overview.desired_outcomes = template.objectives;
    blueprint.kpis = [
      { name: 'Enrollment Rate', target: 0.15, window: 'Quarter' },
      { name: 'Lead Generation', target: 200, window: 'Month' },
      { name: 'Engagement Rate', target: 0.08, window: 'Campaign' }
    ];
    
    // Add template-specific creative angles
    blueprint.creative_angles.ads = [
      {
        label: 'Career Advancement',
        value_prop: `Advance your ${persona.occupation} career with ${template.title}`,
        instructions: 'Focus on career progression and professional growth',
        example: `Ready to advance your ${persona.occupation} career? ${template.title} provides the strategic expertise you need.`
      },
      {
        label: 'Skill Mastery',
        value_prop: template.description,
        instructions: 'Highlight specific skills and competencies gained',
        example: template.description
      },
      {
        label: 'Industry Recognition',
        value_prop: 'Gain recognition as a strategic leader in your field',
        instructions: 'Emphasize professional credibility and industry standing',
        example: `Join the ranks of recognized ${persona.program_category} leaders with advanced strategic training.`
      }
    ];

    // Set budget and timeline from template
    blueprint.assets = [
      { type: 'doc', title: 'Campaign Blueprint', url: '', description: 'Generated campaign blueprint' },
      ...template.creative_assets.map((asset: string) => ({
        type: 'template' as const,
        title: asset.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        url: '',
        description: `${asset} for ${persona.name}`
      }))
    ];

    return blueprint;
  };

  const createCampaigns = async () => {
    if (!user || personas.length === 0) {
      toast({
        title: "No Personas Found",
        description: "Please create personas first",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    setProgress(0);
    setCreatedCount(0);

    for (let i = 0; i < personas.length; i++) {
      const persona = personas[i];
      setCurrentPersona(persona.name);
      
      try {
        const blueprint = await generateBlueprintForPersona(persona);
        
        if (!blueprint) {
          console.warn(`No campaign blueprint found for ${persona.name}`);
          continue;
        }

        // Save blueprint to database
        const { error: blueprintError } = await CampaignBlueprintService.saveBlueprint(blueprint);
        if (blueprintError) throw blueprintError;

        // Create traditional campaign record for backward compatibility
        const campaignData = {
          title: blueprint.name,
          description: blueprint.overview.why_now,
          campaign_type: 'blueprint-driven',
          status: 'active',
          budget: 12000, // Default budget
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          objectives: blueprint.overview.desired_outcomes,
          target_metrics: blueprint.kpis.map(kpi => kpi.name),
          channels: ['LinkedIn', 'industry_publications', 'professional_associations'],
          creative_assets: blueprint.assets.map(asset => asset.title)
        };

        const { data: campaignRecord, error } = await supabase
          .from('campaigns')
          .insert({
            ...campaignData,
            persona_id: persona.id,
            user_id: user.id
          })
          .select()
          .single();

        if (error) throw error;

        // Update blueprint ID to match the campaign ID and re-save
        if (campaignRecord) {
          blueprint.id = campaignRecord.id;
          await CampaignBlueprintService.saveBlueprint(blueprint);
          console.log(`Saved blueprint with campaign ID: ${campaignRecord.id}`);
        }

        setCreatedCount(prev => prev + 1);
        setProgress(((i + 1) / personas.length) * 100);

        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 300));

      } catch (error) {
        console.error(`Error creating campaign for ${persona.name}:`, error);
        toast({
          title: "Error",
          description: `Failed to create campaign for ${persona.name}`,
          variant: "destructive"
        });
      }
    }

    setIsCreating(false);
    setCurrentPersona('');
    
    toast({
      title: "Campaigns Created!",
      description: `Successfully created ${createdCount} tailored campaigns for MSU personas`,
    });
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-muted-foreground">
        Create tailored marketing campaigns for each persona based on their program and career goals.
        {personas.length > 0 && (
          <div className="mt-4 bg-muted/30 p-4 rounded-lg">
            <div className="font-semibold text-foreground mb-2">Found {personas.length} personas ready for campaigns:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {personas.slice(0, 9).map(p => (
                <div key={p.id} className="text-sm bg-background/50 p-2 rounded border">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.program_category}</div>
                </div>
              ))}
              {personas.length > 9 && (
                <div className="text-sm text-muted-foreground p-2 rounded border border-dashed">
                  +{personas.length - 9} more personas
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {isCreating && (
        <div className="space-y-4 bg-muted/30 p-4 rounded-lg">
          <div className="flex justify-between text-sm">
            <span>Creating campaigns...</span>
            <span className="font-medium">{createdCount}/{personas.length}</span>
          </div>
          <Progress value={progress} className="h-3" />
          {currentPersona && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Currently creating: <span className="font-medium text-foreground">{currentPersona}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button 
          onClick={loadPersonas} 
          variant="outline"
          disabled={isCreating}
          size="lg"
          className="px-8"
        >
          Refresh Personas ({personas.length})
        </Button>
        
        <Button 
          onClick={createCampaigns} 
          disabled={isCreating || personas.length === 0}
          size="lg"
          className="px-8"
        >
          {isCreating ? 'Creating Campaigns...' : `Create ${personas.length} Campaigns`}
        </Button>
      </div>
    </div>
  );
}
