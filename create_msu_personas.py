#!/usr/bin/env python3
"""
Script to create MSU personas directly in Supabase database
"""

import os
import sys
from supabase import create_client, Client
from datetime import datetime
import uuid

# Add the project root to the path
sys.path.append('/Users/renaldoedmondson/Library/CloudStorage/Dropbox/projects/ADXAgents/personadb/persona-compass-ui')

# Supabase configuration
SUPABASE_URL = os.getenv('VITE_SUPABASE_URL', 'https://strostafzewfkycctzes.supabase.co')
SUPABASE_ANON_KEY = os.getenv('VITE_SUPABASE_PUBLISHABLE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0cm9zdGFmemV3Zmt5Y2N0emVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDQ5MDIsImV4cCI6MjA2ODI4MDkwMn0.-0oG1dB4RvibQXOEFitA3D4-zs4s8vpojRZgHM1Z7Ec')

def create_supabase_client():
    """Create and return Supabase client"""
    return create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

def create_persona(supabase: Client, persona_data):
    """Create a persona in Supabase"""
    try:
        result = supabase.table('personas').insert(persona_data).execute()
        print(f"✅ Created persona: {persona_data['name']}")
        return result.data[0] if result.data else None
    except Exception as e:
        print(f"❌ Error creating persona {persona_data['name']}: {str(e)}")
        return None

def check_table_schema(supabase: Client):
    """Check the personas table schema"""
    try:
        # Get existing personas to see the schema
        result = supabase.table('personas').select('*').limit(1).execute()
        if result.data:
            print("📋 Existing persona columns:")
            for key in result.data[0].keys():
                print(f"   • {key}")
        return result.data[0].keys() if result.data else []
    except Exception as e:
        print(f"❌ Error checking schema: {str(e)}")
        return []

def main():
    """Main function to create all MSU personas"""
    supabase = create_supabase_client()
    
    # Check table schema first
    print("🔍 Checking personas table schema...")
    columns = check_table_schema(supabase)
    
    # SCM Program Personas
    scm_personas = [
        {
            "name": "Sarah Chen - Operations Manager",
            "program_category": "Supply Chain Management",
            "age_range": "32-42",
            "occupation": "Operations Manager",
            "income_range": "$65k-$95k",
            "education_level": "Bachelor's in Business or Engineering",
            "location": "Midwest manufacturing hubs",
            "description": "Experienced operations manager in manufacturing/automotive industry seeking to advance to director level through strategic SCM expertise and analytics mastery.",
            "goals": ["advance_to_director_level", "increase_strategic_influence", "master_supply_chain_analytics", "improve_operational_efficiency"],
            "pain_points": ["supply_chain_disruptions", "lack_of_strategic_training", "limited_advancement_opportunities", "need_for_data_analytics_skills"],
            "preferred_channels": ["LinkedIn", "industry_publications", "professional_associations", "webinars"],
            "personality_traits": ["analytical", "results_oriented", "strategic_thinking"],
            "values": ["efficiency", "continuous_improvement", "data_driven_decisions"],
            "status": "active"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Marcus Rodriguez - Procurement Specialist",
            "program_category": "Supply Chain Management", 
            "age_range": "28-38",
            "occupation": "Senior Procurement Specialist",
            "income_range": "$55k-$85k",
            "education_level": "Bachelor's in Business, Economics, or related field",
            "location": "Major metropolitan areas",
            "family_status": "Single or newly married",
            "description": "Senior procurement specialist in healthcare/technology/government seeking to become procurement manager through strategic sourcing mastery and vendor negotiation skills.",
            "motivations": ["become_procurement_manager", "master_strategic_sourcing", "develop_vendor_negotiation_skills", "understand_global_supply_chains"],
            "pain_points": ["vendor_relationship_management", "cost_reduction_pressure", "compliance_requirements", "limited_strategic_involvement"],
            "preferred_channels": ["professional_associations", "LinkedIn", "procurement_forums", "industry_conferences"],
            "goals": "Lead strategic sourcing initiatives and become Chief Procurement Officer",
            "communication_style": "Detail-oriented, cost-conscious, relationship-focused",
            "status": "active",
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Jennifer Park - Logistics Coordinator",
            "program_category": "Supply Chain Management",
            "age_range": "26-35", 
            "occupation": "Logistics Coordinator",
            "income_range": "$45k-$70k",
            "education_level": "Bachelor's in Logistics, Business, or related field",
            "location": "Transportation hubs and port cities",
            "family_status": "Single or young family",
            "description": "Logistics coordinator in retail/e-commerce/3PL seeking to advance to logistics manager through transportation optimization and warehouse management expertise.",
            "motivations": ["advance_to_logistics_manager", "master_transportation_optimization", "develop_warehouse_management_skills", "understand_international_logistics"],
            "pain_points": ["delivery_delays_and_disruptions", "inventory_management_challenges", "cost_optimization_pressure", "technology_integration_needs"],
            "preferred_channels": ["logistics_publications", "LinkedIn", "transportation_forums", "supply_chain_webinars"],
            "goals": "Become Logistics Manager and eventually Director of Distribution or VP of Logistics",
            "communication_style": "Solution-oriented, tech-savvy, collaborative",
            "status": "active",
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "David Kim - Supply Chain Analyst",
            "program_category": "Supply Chain Management",
            "age_range": "24-32",
            "occupation": "Supply Chain Analyst", 
            "income_range": "$50k-$75k",
            "education_level": "Bachelor's in Analytics, Engineering, or Business",
            "location": "Major business centers",
            "family_status": "Single or early career professional",
            "description": "Supply chain analyst in consumer goods/technology/pharmaceuticals seeking to advance through analytics mastery and AI/ML applications in supply chain.",
            "motivations": ["advance_to_senior_analyst_role", "master_supply_chain_analytics", "develop_forecasting_expertise", "understand_AI_and_machine_learning_applications"],
            "pain_points": ["data_quality_issues", "demand_forecasting_accuracy", "limited_strategic_input", "need_for_advanced_analytics_skills"],
            "preferred_channels": ["analytics_communities", "LinkedIn", "data_science_forums", "supply_chain_tech_blogs"],
            "goals": "Become Senior Supply Chain Analyst and eventually Supply Chain Planning Manager or Analytics Director",
            "communication_style": "Analytical, data-driven, forward-thinking",
            "status": "active",
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
    ]
    
    # MSL Program Personas
    msl_personas = [
        {
            "id": str(uuid.uuid4()),
            "name": "Amanda Thompson - Team Leader",
            "program_category": "Management and Leadership",
            "age_range": "30-40",
            "occupation": "Team Leader",
            "income_range": "$60k-$90k",
            "education_level": "Bachelor's degree in any field",
            "location": "Suburban and urban areas",
            "family_status": "Married with children",
            "description": "Team leader in healthcare/financial services/technology seeking to advance to management through improved leadership skills and strategic thinking development.",
            "motivations": ["advance_to_management_role", "improve_leadership_skills", "increase_team_effectiveness", "develop_strategic_thinking"],
            "pain_points": ["managing_difficult_team_members", "lack_of_formal_leadership_training", "balancing_work_and_family", "limited_advancement_opportunities"],
            "preferred_channels": ["LinkedIn", "management_blogs", "professional_development_sites", "company_internal_communications"],
            "goals": "Become Department Manager and eventually reach Director or VP level position",
            "communication_style": "Supportive, growth-oriented, practical",
            "status": "active",
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Robert Martinez - Project Manager",
            "program_category": "Management and Leadership",
            "age_range": "28-38",
            "occupation": "Project Manager",
            "income_range": "$65k-$95k",
            "education_level": "Bachelor's in Business, Engineering, or related field",
            "location": "Major metropolitan areas",
            "family_status": "Married or in long-term relationship",
            "description": "Project manager in technology/construction/consulting seeking to advance to senior PM or program manager through enhanced leadership and strategic management skills.",
            "motivations": ["advance_to_senior_pm_role", "improve_stakeholder_management", "develop_strategic_planning_skills", "enhance_team_leadership"],
            "pain_points": ["managing_cross_functional_teams", "stakeholder_alignment_challenges", "resource_constraints", "need_for_advanced_leadership_skills"],
            "preferred_channels": ["project_management_communities", "LinkedIn", "PMI_resources", "management_conferences"],
            "goals": "Become Senior Project Manager or Program Manager, eventually VP of Operations",
            "communication_style": "Organized, results-driven, diplomatic",
            "status": "active",
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Lisa Wang - Department Supervisor",
            "program_category": "Management and Leadership",
            "age_range": "35-45",
            "occupation": "Department Supervisor",
            "income_range": "$55k-$85k",
            "education_level": "Bachelor's degree, some with Associate's",
            "location": "Mid-size cities and suburbs",
            "family_status": "Married with children",
            "description": "Department supervisor in manufacturing/retail/healthcare seeking to advance to management through formal leadership training and organizational development skills.",
            "motivations": ["advance_to_management_position", "improve_employee_engagement", "develop_organizational_skills", "enhance_decision_making_abilities"],
            "pain_points": ["employee_performance_management", "organizational_change_resistance", "limited_formal_training", "work_life_balance_challenges"],
            "preferred_channels": ["industry_associations", "LinkedIn", "supervisor_training_programs", "HR_resources"],
            "goals": "Become Department Manager and eventually Operations Director",
            "communication_style": "Empathetic, structured, people-focused",
            "status": "active",
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Michael Johnson - Emerging Leader",
            "program_category": "Management and Leadership",
            "age_range": "26-35",
            "occupation": "Senior Associate/Lead",
            "income_range": "$50k-$75k",
            "education_level": "Bachelor's degree in various fields",
            "location": "Urban and suburban areas",
            "family_status": "Single or newly married",
            "description": "High-performing individual contributor identified for leadership potential seeking formal management training to transition into supervisory roles.",
            "motivations": ["transition_to_leadership_role", "develop_management_skills", "increase_career_prospects", "build_leadership_confidence"],
            "pain_points": ["lack_of_leadership_experience", "uncertainty_about_management_transition", "need_for_formal_training", "imposter_syndrome"],
            "preferred_channels": ["LinkedIn", "career_development_sites", "professional_mentorship_programs", "leadership_blogs"],
            "goals": "Become Team Leader or Supervisor, eventually Department Manager",
            "communication_style": "Eager, ambitious, learning-oriented",
            "status": "active",
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
    ]
    
    # HCM Program Personas
    hcm_personas = [
        {
            "id": str(uuid.uuid4()),
            "name": "Rachel Foster - HR Generalist",
            "program_category": "Human Capital Management",
            "age_range": "28-38",
            "occupation": "HR Generalist",
            "income_range": "$50k-$75k",
            "education_level": "Bachelor's in HR, Business, or Psychology",
            "location": "Mid to large metropolitan areas",
            "family_status": "Single or married without children",
            "description": "HR generalist seeking to advance to HR manager or specialist roles through strategic HCM expertise and organizational development skills.",
            "motivations": ["advance_to_hr_manager", "specialize_in_strategic_hr", "develop_organizational_development_skills", "master_hr_analytics"],
            "pain_points": ["limited_strategic_involvement", "need_for_advanced_hr_skills", "employee_relations_challenges", "compliance_complexity"],
            "preferred_channels": ["SHRM_resources", "LinkedIn", "HR_publications", "professional_hr_associations"],
            "goals": "Become HR Manager and eventually HR Director or Chief People Officer",
            "communication_style": "People-focused, strategic, compliance-oriented",
            "status": "active",
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Carlos Rivera - Training Coordinator",
            "program_category": "Human Capital Management",
            "age_range": "26-36",
            "occupation": "Training and Development Coordinator",
            "income_range": "$45k-$70k",
            "education_level": "Bachelor's in Education, HR, or related field",
            "location": "Various metropolitan areas",
            "family_status": "Single or young family",
            "description": "Training coordinator seeking to advance to learning and development manager through instructional design expertise and organizational development skills.",
            "motivations": ["advance_to_ld_manager", "master_instructional_design", "develop_organizational_training_programs", "understand_adult_learning_principles"],
            "pain_points": ["measuring_training_effectiveness", "limited_budget_resources", "engaging_diverse_learners", "technology_integration_challenges"],
            "preferred_channels": ["training_industry_publications", "LinkedIn", "ATD_resources", "learning_technology_forums"],
            "goals": "Become Learning and Development Manager, eventually Chief Learning Officer",
            "communication_style": "Educational, innovative, results-focused",
            "status": "active",
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Patricia Adams - Benefits Administrator",
            "program_category": "Human Capital Management",
            "age_range": "32-42",
            "occupation": "Benefits Administrator",
            "income_range": "$48k-$72k",
            "education_level": "Bachelor's in HR, Business, or related field",
            "location": "Mid-size cities and metropolitan areas",
            "family_status": "Married with children",
            "description": "Benefits administrator seeking to advance to compensation and benefits manager through strategic total rewards expertise and employee wellness program development.",
            "motivations": ["advance_to_compensation_manager", "master_total_rewards_strategy", "develop_wellness_programs", "understand_benefits_analytics"],
            "pain_points": ["complex_benefits_regulations", "cost_containment_pressure", "employee_benefits_communication", "vendor_management_challenges"],
            "preferred_channels": ["benefits_industry_publications", "LinkedIn", "WorldatWork_resources", "benefits_conferences"],
            "goals": "Become Compensation and Benefits Manager, eventually Total Rewards Director",
            "communication_style": "Detail-oriented, analytical, employee-focused",
            "status": "active",
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "James Mitchell - Talent Acquisition Specialist",
            "program_category": "Human Capital Management",
            "age_range": "25-35",
            "occupation": "Talent Acquisition Specialist",
            "income_range": "$45k-$70k",
            "education_level": "Bachelor's in HR, Business, or Psychology",
            "location": "Major metropolitan areas",
            "family_status": "Single or newly married",
            "description": "Talent acquisition specialist seeking to advance to senior recruiter or talent acquisition manager through strategic recruiting and employer branding expertise.",
            "motivations": ["advance_to_senior_recruiter", "master_strategic_recruiting", "develop_employer_branding_skills", "understand_recruiting_analytics"],
            "pain_points": ["talent_shortage_challenges", "candidate_experience_optimization", "recruiting_technology_adoption", "diversity_and_inclusion_goals"],
            "preferred_channels": ["recruiting_communities", "LinkedIn", "talent_acquisition_blogs", "HR_technology_forums"],
            "goals": "Become Senior Talent Acquisition Partner, eventually Head of Talent Acquisition",
            "communication_style": "Relationship-focused, persuasive, data-driven",
            "status": "active",
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
    ]
    
    # Create all personas
    all_personas = scm_personas + msl_personas + hcm_personas
    created_personas = []
    
    print("🚀 Creating MSU personas in Supabase...")
    print(f"📊 Total personas to create: {len(all_personas)}")
    
    for persona in all_personas:
        created_persona = create_persona(supabase, persona)
        if created_persona:
            created_personas.append(created_persona)
    
    print(f"\n✅ Successfully created {len(created_personas)} personas")
    print("📋 Created personas:")
    for persona in created_personas:
        print(f"   • {persona['name']} ({persona['program_category']})")

if __name__ == "__main__":
    main()
