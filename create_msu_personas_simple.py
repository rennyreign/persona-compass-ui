#!/usr/bin/env python3
"""
Simple script to create MSU personas in Supabase with correct schema
"""

import os
from supabase import create_client

# Supabase configuration
SUPABASE_URL = 'https://strostafzewfkycctzes.supabase.co'
SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0cm9zdGFmemV3Zmt5Y2N0emVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDQ5MDIsImV4cCI6MjA2ODI4MDkwMn0.-0oG1dB4RvibQXOEFitA3D4-zs4s8vpojRZgHM1Z7Ec'

def main():
    supabase = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
    
    # First, let's delete existing personas
    print("🗑️ Deleting existing personas...")
    try:
        result = supabase.table('personas').delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()
        print(f"✅ Deleted existing personas")
    except Exception as e:
        print(f"❌ Error deleting personas: {e}")
    
    # Create MSU personas with minimal required fields
    personas = [
        # SCM Program
        {
            "name": "Sarah Chen - Operations Manager",
            "program_category": "Supply Chain Management",
            "age_range": "32-42",
            "occupation": "Operations Manager",
            "income_range": "$65k-$95k",
            "education_level": "Bachelor's in Business or Engineering",
            "location": "Midwest manufacturing hubs",
            "description": "Experienced operations manager seeking to advance to director level through strategic SCM expertise.",
            "goals": ["advance_to_director_level", "master_supply_chain_analytics"],
            "pain_points": ["supply_chain_disruptions", "lack_of_strategic_training"],
            "preferred_channels": ["LinkedIn", "industry_publications"],
            "status": "active"
        },
        {
            "name": "Marcus Rodriguez - Procurement Specialist", 
            "program_category": "Supply Chain Management",
            "age_range": "28-38",
            "occupation": "Senior Procurement Specialist",
            "income_range": "$55k-$85k",
            "education_level": "Bachelor's in Business",
            "location": "Major metropolitan areas",
            "description": "Senior procurement specialist seeking to become procurement manager through strategic sourcing mastery.",
            "goals": ["become_procurement_manager", "master_strategic_sourcing"],
            "pain_points": ["vendor_relationship_management", "cost_reduction_pressure"],
            "preferred_channels": ["professional_associations", "LinkedIn"],
            "status": "active"
        },
        {
            "name": "Jennifer Park - Logistics Coordinator",
            "program_category": "Supply Chain Management",
            "age_range": "26-35",
            "occupation": "Logistics Coordinator", 
            "income_range": "$45k-$70k",
            "education_level": "Bachelor's in Logistics",
            "location": "Transportation hubs",
            "description": "Logistics coordinator seeking to advance through transportation optimization expertise.",
            "goals": ["advance_to_logistics_manager", "master_transportation_optimization"],
            "pain_points": ["delivery_delays", "inventory_management_challenges"],
            "preferred_channels": ["logistics_publications", "LinkedIn"],
            "status": "active"
        },
        {
            "name": "David Kim - Supply Chain Analyst",
            "program_category": "Supply Chain Management",
            "age_range": "24-32",
            "occupation": "Supply Chain Analyst",
            "income_range": "$50k-$75k", 
            "education_level": "Bachelor's in Analytics",
            "location": "Major business centers",
            "description": "Supply chain analyst seeking advancement through analytics mastery and AI/ML applications.",
            "goals": ["advance_to_senior_analyst", "master_supply_chain_analytics"],
            "pain_points": ["data_quality_issues", "demand_forecasting_accuracy"],
            "preferred_channels": ["analytics_communities", "LinkedIn"],
            "status": "active"
        },
        # MSL Program
        {
            "name": "Amanda Thompson - Team Leader",
            "program_category": "Management and Leadership",
            "age_range": "30-40",
            "occupation": "Team Leader",
            "income_range": "$60k-$90k",
            "education_level": "Bachelor's degree",
            "location": "Suburban areas",
            "description": "Team leader seeking to advance to management through improved leadership skills.",
            "goals": ["advance_to_management_role", "improve_leadership_skills"],
            "pain_points": ["managing_difficult_team_members", "lack_of_formal_training"],
            "preferred_channels": ["LinkedIn", "management_blogs"],
            "status": "active"
        },
        {
            "name": "Robert Martinez - Project Manager",
            "program_category": "Management and Leadership",
            "age_range": "28-38",
            "occupation": "Project Manager",
            "income_range": "$65k-$95k",
            "education_level": "Bachelor's in Business",
            "location": "Metropolitan areas",
            "description": "Project manager seeking to advance through enhanced leadership and strategic management skills.",
            "goals": ["advance_to_senior_pm", "improve_stakeholder_management"],
            "pain_points": ["managing_cross_functional_teams", "stakeholder_alignment"],
            "preferred_channels": ["project_management_communities", "LinkedIn"],
            "status": "active"
        },
        {
            "name": "Lisa Wang - Department Supervisor",
            "program_category": "Management and Leadership",
            "age_range": "35-45",
            "occupation": "Department Supervisor",
            "income_range": "$55k-$85k",
            "education_level": "Bachelor's degree",
            "location": "Mid-size cities",
            "description": "Department supervisor seeking to advance through formal leadership training.",
            "goals": ["advance_to_management", "improve_employee_engagement"],
            "pain_points": ["employee_performance_management", "organizational_change"],
            "preferred_channels": ["industry_associations", "LinkedIn"],
            "status": "active"
        },
        {
            "name": "Michael Johnson - Emerging Leader",
            "program_category": "Management and Leadership",
            "age_range": "26-35",
            "occupation": "Senior Associate",
            "income_range": "$50k-$75k",
            "education_level": "Bachelor's degree",
            "location": "Urban areas",
            "description": "High-performing individual contributor seeking formal management training for leadership transition.",
            "goals": ["transition_to_leadership", "develop_management_skills"],
            "pain_points": ["lack_of_leadership_experience", "need_for_formal_training"],
            "preferred_channels": ["LinkedIn", "career_development_sites"],
            "status": "active"
        },
        # HCM Program
        {
            "name": "Rachel Foster - HR Generalist",
            "program_category": "Human Capital Management",
            "age_range": "28-38",
            "occupation": "HR Generalist",
            "income_range": "$50k-$75k",
            "education_level": "Bachelor's in HR",
            "location": "Metropolitan areas",
            "description": "HR generalist seeking to advance through strategic HCM expertise.",
            "goals": ["advance_to_hr_manager", "specialize_in_strategic_hr"],
            "pain_points": ["limited_strategic_involvement", "need_for_advanced_skills"],
            "preferred_channels": ["SHRM_resources", "LinkedIn"],
            "status": "active"
        },
        {
            "name": "Carlos Rivera - Training Coordinator",
            "program_category": "Human Capital Management",
            "age_range": "26-36",
            "occupation": "Training Coordinator",
            "income_range": "$45k-$70k",
            "education_level": "Bachelor's in Education",
            "location": "Various metropolitan areas",
            "description": "Training coordinator seeking to advance through instructional design expertise.",
            "goals": ["advance_to_ld_manager", "master_instructional_design"],
            "pain_points": ["measuring_training_effectiveness", "limited_budget"],
            "preferred_channels": ["training_publications", "LinkedIn"],
            "status": "active"
        },
        {
            "name": "Patricia Adams - Benefits Administrator",
            "program_category": "Human Capital Management",
            "age_range": "32-42",
            "occupation": "Benefits Administrator",
            "income_range": "$48k-$72k",
            "education_level": "Bachelor's in HR",
            "location": "Mid-size cities",
            "description": "Benefits administrator seeking to advance through strategic total rewards expertise.",
            "goals": ["advance_to_compensation_manager", "master_total_rewards"],
            "pain_points": ["complex_regulations", "cost_containment_pressure"],
            "preferred_channels": ["benefits_publications", "LinkedIn"],
            "status": "active"
        },
        {
            "name": "James Mitchell - Talent Acquisition Specialist",
            "program_category": "Human Capital Management",
            "age_range": "25-35",
            "occupation": "Talent Acquisition Specialist",
            "income_range": "$45k-$70k",
            "education_level": "Bachelor's in HR",
            "location": "Major metropolitan areas",
            "description": "Talent acquisition specialist seeking to advance through strategic recruiting expertise.",
            "goals": ["advance_to_senior_recruiter", "master_strategic_recruiting"],
            "pain_points": ["talent_shortage", "candidate_experience_optimization"],
            "preferred_channels": ["recruiting_communities", "LinkedIn"],
            "status": "active"
        }
    ]
    
    print(f"🚀 Creating {len(personas)} MSU personas...")
    created_count = 0
    
    for persona in personas:
        try:
            result = supabase.table('personas').insert(persona).execute()
            print(f"✅ Created: {persona['name']}")
            created_count += 1
        except Exception as e:
            print(f"❌ Error creating {persona['name']}: {e}")
    
    print(f"\n🎉 Successfully created {created_count}/{len(personas)} personas!")

if __name__ == "__main__":
    main()
