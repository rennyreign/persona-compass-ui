#!/usr/bin/env python3
"""
Test script to debug Supabase integration for ORDAE system
"""
import sys
sys.path.append('orchestrator')

from orchestrator.tools.supabase_client import supabase_integration

def test_supabase_connection():
    print("🔍 Testing Supabase Integration...")
    
    # Test connection
    print(f"Connected: {supabase_integration.is_connected()}")
    
    if not supabase_integration.is_connected():
        print("❌ Supabase not connected")
        return
    
    # Test organization creation
    print("\n📋 Testing organization creation...")
    university_data = {
        "id": "msu",
        "name": "Michigan State University"
    }
    
    org_id = supabase_integration.create_organization_if_not_exists(university_data)
    print(f"Organization ID: {org_id}")
    
    # Test persona creation
    print("\n👤 Testing persona creation...")
    test_persona = {
        "id": "test_msu_mba_career_changer",
        "university": {"id": "msu", "name": "Michigan State University"},
        "program": {"id": "mba", "name": "MBA Program", "enrollment_goal": 150},
        "persona_type": "career_changer",
        "demographics": {"age_range": "28-40", "income_range": "$50k-$80k", "education": "Bachelor's degree"},
        "motivations": ["career_advancement", "salary_increase"],
        "pain_points": ["time_constraints", "financial_concerns"],
        "preferred_channels": ["LinkedIn", "professional_networks"],
        "behavior_patterns": {"research_phase_duration": "2-4 weeks"},
        "conversion_triggers": {"primary": "application_deadline_approaching"},
        "attribution_data": {"typical_touchpoints": 7},
        "created_by": "test_script",
        "data_completeness": 0.85
    }
    
    persona_id = supabase_integration.create_persona(test_persona)
    print(f"Created persona ID: {persona_id}")
    
    if persona_id:
        print("✅ Supabase integration working!")
    else:
        print("❌ Persona creation failed")

if __name__ == "__main__":
    test_supabase_connection()
