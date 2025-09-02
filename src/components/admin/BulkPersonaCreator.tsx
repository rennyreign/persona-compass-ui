import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface BulkPersonaCreatorProps {
  selectedOrganization: string;
}

const MSU_PERSONAS = [
  // SCM Program
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
    name: "Jennifer Park - Logistics Coordinator",
    program_category: "Supply Chain Management",
    age_range: "26-35",
    occupation: "Logistics Coordinator", 
    income_range: "$45k-$70k",
    education_level: "Bachelor's in Logistics",
    location: "Transportation hubs",
    description: "Logistics coordinator seeking to advance through transportation optimization expertise.",
    goals: ["advance_to_logistics_manager", "master_transportation_optimization"],
    pain_points: ["delivery_delays", "inventory_management_challenges"],
    preferred_channels: ["logistics_publications", "LinkedIn"],
    personality_traits: ["solution_oriented", "tech_savvy", "collaborative"],
    values: ["optimization", "efficiency", "innovation", "streamlined"],
    status: "active"
  },
  {
    name: "David Kim - Supply Chain Analyst",
    program_category: "Supply Chain Management",
    age_range: "24-32",
    occupation: "Supply Chain Analyst",
    income_range: "$50k-$75k", 
    education_level: "Bachelor's in Analytics",
    location: "Major business centers",
    description: "Supply chain analyst seeking advancement through analytics mastery and AI/ML applications.",
    goals: ["advance_to_senior_analyst", "master_supply_chain_analytics"],
    pain_points: ["data_quality_issues", "demand_forecasting_accuracy"],
    preferred_channels: ["analytics_communities", "LinkedIn"],
    personality_traits: ["analytical", "data_driven", "forward_thinking"],
    values: ["insights", "predictive", "optimization", "intelligence"],
    status: "active"
  },
  // MSL Program
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
    name: "Robert Martinez - Project Manager",
    program_category: "Management and Leadership",
    age_range: "28-38",
    occupation: "Project Manager",
    income_range: "$65k-$95k",
    education_level: "Bachelor's in Business",
    location: "Metropolitan areas",
    description: "Project manager seeking to advance through enhanced leadership and strategic management skills.",
    goals: ["advance_to_senior_pm", "improve_stakeholder_management"],
    pain_points: ["managing_cross_functional_teams", "stakeholder_alignment"],
    preferred_channels: ["project_management_communities", "LinkedIn"],
    personality_traits: ["organized", "results_driven", "diplomatic"],
    values: ["planning", "execution", "stakeholder_satisfaction", "delivery"],
    status: "active"
  },
  {
    name: "Lisa Wang - Department Supervisor",
    program_category: "Management and Leadership",
    age_range: "35-45",
    occupation: "Department Supervisor",
    income_range: "$55k-$85k",
    education_level: "Bachelor's degree",
    location: "Mid-size cities",
    description: "Department supervisor seeking to advance through formal leadership training.",
    goals: ["advance_to_management", "improve_employee_engagement"],
    pain_points: ["employee_performance_management", "organizational_change"],
    preferred_channels: ["industry_associations", "LinkedIn"],
    personality_traits: ["empathetic", "structured", "people_focused"],
    values: ["employee_development", "organizational_health", "performance"],
    status: "active"
  },
  {
    name: "Michael Johnson - Emerging Leader",
    program_category: "Management and Leadership",
    age_range: "26-35",
    occupation: "Senior Associate",
    income_range: "$50k-$75k",
    education_level: "Bachelor's degree",
    location: "Urban areas",
    description: "High-performing individual contributor seeking formal management training for leadership transition.",
    goals: ["transition_to_leadership", "develop_management_skills"],
    pain_points: ["lack_of_leadership_experience", "need_for_formal_training"],
    preferred_channels: ["LinkedIn", "career_development_sites"],
    personality_traits: ["eager", "ambitious", "learning_oriented"],
    values: ["growth", "opportunity", "skill_development", "advancement"],
    status: "active"
  },
  // HCM Program
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
  },
  {
    name: "Carlos Rivera - Training Coordinator",
    program_category: "Human Capital Management",
    age_range: "26-36",
    occupation: "Training Coordinator",
    income_range: "$45k-$70k",
    education_level: "Bachelor's in Education",
    location: "Various metropolitan areas",
    description: "Training coordinator seeking to advance through instructional design expertise.",
    goals: ["advance_to_ld_manager", "master_instructional_design"],
    pain_points: ["measuring_training_effectiveness", "limited_budget"],
    preferred_channels: ["training_publications", "LinkedIn"],
    personality_traits: ["educational", "innovative", "results_focused"],
    values: ["learning", "development", "engagement", "effectiveness"],
    status: "active"
  },
  {
    name: "Patricia Adams - Benefits Administrator",
    program_category: "Human Capital Management",
    age_range: "32-42",
    occupation: "Benefits Administrator",
    income_range: "$48k-$72k",
    education_level: "Bachelor's in HR",
    location: "Mid-size cities",
    description: "Benefits administrator seeking to advance through strategic total rewards expertise.",
    goals: ["advance_to_compensation_manager", "master_total_rewards"],
    pain_points: ["complex_regulations", "cost_containment_pressure"],
    preferred_channels: ["benefits_publications", "LinkedIn"],
    personality_traits: ["detail_oriented", "analytical", "employee_focused"],
    values: ["employee_wellbeing", "cost_effectiveness", "compliance"],
    status: "active"
  },
  {
    name: "James Mitchell - Talent Acquisition Specialist",
    program_category: "Human Capital Management",
    age_range: "25-35",
    occupation: "Talent Acquisition Specialist",
    income_range: "$45k-$70k",
    education_level: "Bachelor's in HR",
    location: "Major metropolitan areas",
    description: "Talent acquisition specialist seeking to advance through strategic recruiting expertise.",
    goals: ["advance_to_senior_recruiter", "master_strategic_recruiting"],
    pain_points: ["talent_shortage", "candidate_experience_optimization"],
    preferred_channels: ["recruiting_communities", "LinkedIn"],
    personality_traits: ["relationship_focused", "persuasive", "data_driven"],
    values: ["talent_quality", "candidate_experience", "diversity", "efficiency"],
    status: "active"
  }
];

export function BulkPersonaCreator({ selectedOrganization }: BulkPersonaCreatorProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [createdCount, setCreatedCount] = useState(0);
  const [currentPersona, setCurrentPersona] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  const createPersonas = async () => {
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

    // Use the selected organization
    const organizationId = selectedOrganization;

    // Delete existing personas
    try {
      await supabase.from('personas').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      toast({
        title: "Cleanup Complete",
        description: "Existing personas have been removed"
      });
    } catch (error) {
      console.error('Error deleting existing personas:', error);
    }

    // Create new personas
    for (let i = 0; i < MSU_PERSONAS.length; i++) {
      const persona = MSU_PERSONAS[i];
      setCurrentPersona(persona.name);
      
      try {
        const { data, error } = await supabase
          .from('personas')
          .insert({
            ...persona,
            user_id: user.id,
            organization_id: organizationId
          });

        if (error) throw error;

        setCreatedCount(prev => prev + 1);
        setProgress(((i + 1) / MSU_PERSONAS.length) * 100);

        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (error) {
        console.error(`Error creating persona ${persona.name}:`, error);
        toast({
          title: "Error",
          description: `Failed to create ${persona.name}`,
          variant: "destructive"
        });
      }
    }

    setIsCreating(false);
    setCurrentPersona('');
    
    toast({
      title: "Personas Created!",
      description: `Successfully created ${createdCount} MSU personas`,
    });
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-muted-foreground">
        This will create 12 personas for the selected university programs:
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

      {isCreating && (
        <div className="space-y-4 bg-muted/30 p-4 rounded-lg">
          <div className="flex justify-between text-sm">
            <span>Creating personas...</span>
            <span className="font-medium">{createdCount}/{MSU_PERSONAS.length}</span>
          </div>
          <Progress value={progress} className="h-3" />
          {currentPersona && (
            <div className="text-sm text-muted-foreground">
              Currently creating: <span className="font-medium text-foreground">{currentPersona}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-center">
        <Button 
          onClick={createPersonas} 
          disabled={isCreating}
          size="lg"
          className="px-8"
        >
          {isCreating ? 'Creating Personas...' : 'Create All Personas'}
        </Button>
      </div>
    </div>
  );
}
