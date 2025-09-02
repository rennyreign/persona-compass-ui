"""
Director Agent (Act) - Issues concrete build/test/deploy instructions
"""
import json
import asyncio
from pathlib import Path
from typing import Dict, Any, List
from rich.console import Console
from ..tools.rag_loader import RAGLoader
from ..tools.supabase_client import supabase_integration

console = Console()

def act(state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Execute actions based on strategic decision
    Creates files and generates build commands
    """
    console.print("⚡ [bold red]Director Agent:[/bold red] Taking action...")
    
    decision = state.get("decision", {})
    lane = decision.get("lane", "")
    task = decision.get("task", "")
    
    cmds = []
    actions_taken = []
    
    if lane == "university_onboarding" and task == "create_university_personas":
        # Create personas for specific university
        target_university = decision.get("target_university")
        university_config = state.get("snapshot", {}).get("university_config")
        
        if target_university and university_config:
            personas_created = create_university_personas(target_university, university_config)
            actions_taken.extend(personas_created)
            cmds.extend([
                f"# university_onboarding_{target_university}",
                f"echo 'Created {len(personas_created)} personas for {target_university}'"
            ])
    
    elif lane == "marketing" and task == "optimize_university_campaigns":
        # Create comprehensive campaign optimization for all universities
        university_config = state.get("snapshot", {}).get("university_config")
        if university_config:
            campaign_files = create_university_campaign_optimization(university_config)
            actions_taken.extend(campaign_files)
            cmds.extend([
                "# optimize_campaigns",
                f"echo 'Created campaign optimization for {len(campaign_files)} university programs'"
            ])
    
    elif lane == "product" and task == "build_attribution_page":
        # Create attribution page in src/pages/
        repo_root = Path.cwd()
        pages_dir = repo_root / "src" / "pages"
        pages_dir.mkdir(parents=True, exist_ok=True)
        
        attribution_file = pages_dir / "Attribution.tsx"
        if not attribution_file.exists():
            attribution_content = '''import React from 'react';

export default function Attribution() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Attribution Dashboard</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Persona Performance Attribution</h2>
          <p className="text-gray-600 mb-4">
            This page will show which personas drive enrollment outcomes and campaign performance.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900">Persona #1</h3>
              <p className="text-sm text-blue-700">Career Changer</p>
              <div className="mt-2 text-2xl font-bold text-blue-600">85%</div>
              <p className="text-xs text-blue-500">Conversion Rate</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-900">Persona #2</h3>
              <p className="text-sm text-green-700">Recent Graduate</p>
              <div className="mt-2 text-2xl font-bold text-green-600">72%</div>
              <p className="text-xs text-green-500">Conversion Rate</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-900">Persona #3</h3>
              <p className="text-sm text-purple-700">Working Professional</p>
              <div className="mt-2 text-2xl font-bold text-purple-600">68%</div>
              <p className="text-xs text-purple-500">Conversion Rate</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}'''
            attribution_file.write_text(attribution_content)
            actions_taken.append(f"Created attribution page: {attribution_file}")
            console.print(f"✅ Created {attribution_file}")
        
        cmds.extend([
            "# build_app",
            "npm run build",
            "npm run preview"
        ])
        
    elif lane == "marketing" and task == "plan_ab_for_first_persona":
        # Create AB testing plan
        repo_root = Path.cwd()
        persona_data_dir = repo_root / "persona_data"
        persona_data_dir.mkdir(parents=True, exist_ok=True)
        
        ab_plan_file = persona_data_dir / "AB_PLAN.md"
        if not ab_plan_file.exists():
            ab_plan_content = '''# AB Testing Plan - PersonaOps

## Persona #1: Career Changer AB Test

### Hypothesis
Career changers respond better to LinkedIn messaging focused on "transformation" vs Twitter messaging focused on "opportunity"

### Test Setup
- **Variant A (LinkedIn):** "Transform your career with our proven program"
- **Variant B (Twitter):** "Seize new opportunities in your field"
- **Duration:** 2 weeks
- **Sample Size:** 500 per variant
- **Success Metric:** Click-through rate to enrollment page

### Implementation Checklist
- [ ] Create LinkedIn ad creative (Variant A)
- [ ] Create Twitter ad creative (Variant B) 
- [ ] Set up tracking pixels
- [ ] Configure attribution reporting
- [ ] Launch campaigns simultaneously
- [ ] Monitor daily performance
- [ ] Collect results after 2 weeks

### Expected Outcomes
- Identify which messaging resonates better with career changers
- Optimize future campaigns based on winning variant
- Feed results back into persona refinement

---
*Generated by PersonaOps ORDAE System*
'''
            ab_plan_file.write_text(ab_plan_content)
            actions_taken.append(f"Created AB testing plan: {ab_plan_file}")
            console.print(f"✅ Created {ab_plan_file}")
        
        cmds.extend([
            "# plan_marketing",
            "echo 'AB testing plan created and ready for execution'"
        ])
    
    actions = {
        "lane": lane,
        "task": task,
        "commands": cmds,
        "files_created": actions_taken,
        "status": "completed" if actions_taken else "no_action_needed"
    }
    
    console.print(f"🎬 Executed {len(actions_taken)} actions")
    for action in actions_taken:
        console.print(f"   • {action}")
    
    state["actions"] = actions
    return state

def create_university_personas(university_id: str, university_config: dict) -> list:
    """Create personas for university programs using RAG data and store in Supabase"""
    console.print(f"🎓 Creating personas for {university_id} university...")
    
    repo_root = Path.cwd()
    persona_data_dir = repo_root / "persona_data"
    persona_data_dir.mkdir(exist_ok=True)
    
    # Load RAG data for the university
    rag_loader = RAGLoader()
    rag_data = {
        'brand_guidelines': rag_loader.load_university_brand_guidelines(university_id),
        'voice_tone': rag_loader.load_university_voice_tone(university_id),
        'messaging': rag_loader.load_university_messaging(university_id),
        'programs': rag_loader.load_program_catalog(university_id)
    }
    
    actions_taken = []
    
    # Find the university in config
    university = None
    for uni in university_config.get("universities", []):
        if uni.get("id") == university_id:
            university = uni
            break
    
    if not university:
        console.print(f"❌ University {university_id} not found in config")
        return actions_taken
    
    # Ensure organization exists in Supabase and get UUID
    org_uuid = None
    if supabase_integration.is_connected():
        org_uuid = supabase_integration.create_organization_if_not_exists(university)
    
    # Create personas for each program
    for program in university.get("programs", []):
        program_id = program.get("id")
        program_name = program.get("name")
        target_personas = program.get("target_personas", [])
        
        console.print(f"📚 Processing program: {program_name}")
        
        for persona_type in target_personas:
            persona_id = f"{university_id}_{program_id}_{persona_type}"
            persona_file = persona_data_dir / f"{persona_id}.json"
            
            # Get persona template from config
            persona_template = university_config.get("persona_templates", {}).get(persona_type, {})
            
            # Create enhanced persona data with RAG integration
            persona_data = {
                "id": persona_id,
                "university": {
                    "id": university_id,
                    "name": university.get("name")
                },
                "program": {
                    "id": program_id,
                    "name": program_name,
                    "enrollment_goal": program.get("enrollment_goals", 100)
                },
                "persona_type": persona_type,
                "demographics": persona_template.get("demographics", {}),
                "motivations": persona_template.get("motivations", []),
                "pain_points": persona_template.get("pain_points", []),
                "preferred_channels": persona_template.get("channels", []),
                "behavior_patterns": {
                    "research_phase_duration": "2-4 weeks",
                    "decision_factors": [
                        "program_reputation",
                        "flexibility", 
                        "cost",
                        "career_outcomes"
                    ],
                    "content_preferences": [
                        "case_studies",
                        "alumni_testimonials", 
                        "program_details"
                    ]
                },
                "conversion_triggers": {
                    "primary": "application_deadline_approaching",
                    "secondary": [
                        "scholarship_availability",
                        "peer_recommendations",
                        "career_advancement_urgency"
                    ]
                },
                "attribution_data": {
                    "typical_touchpoints": 7,
                    "conversion_timeline": "30-60 days",
                    "high_value_channels": persona_template.get("channels", [])[:2]
                },
                "created_by": "ordae_system",
                "created_at": str(Path.cwd()),
                "data_completeness": 0.85
            }
            
            # Enhance with RAG data if available
            if rag_data:
                persona_data = enhance_persona_with_rag(persona_data, rag_data, program_id, persona_type)
            
            # Store in Supabase if connected, otherwise save to file
            if supabase_integration.is_connected() and org_uuid:
                supabase_persona_id = supabase_integration.create_persona(persona_data, "ordae-system", org_uuid)
                if supabase_persona_id:
                    actions_taken.append(f"Created persona in Supabase: {persona_id}")
                    console.print(f"✅ Created persona in Supabase: {persona_id}")
                else:
                    # Fallback to file storage
                    with open(persona_file, 'w') as f:
                        json.dump(persona_data, f, indent=2)
                    actions_taken.append(f"Created persona file (Supabase failed): {persona_file}")
                    console.print(f"⚠️  Created persona file as fallback: {persona_id}")
            else:
                # Save persona to file as fallback
                with open(persona_file, 'w') as f:
                    json.dump(persona_data, f, indent=2)
                actions_taken.append(f"Created persona file: {persona_file}")
                console.print(f"✅ Created persona file: {persona_id}")
    
    return actions_taken

def enhance_persona_with_rag(persona_data: dict, rag_data: dict, program_id: str, persona_type: str) -> dict:
    """Enhance persona data with RAG knowledge base information"""
    
    # Extract RAG components
    brand_guidelines = rag_data.get('brand_guidelines', {})
    voice_tone = rag_data.get('voice_tone', {})
    messaging = rag_data.get('messaging', {})
    programs = rag_data.get('programs', {})
    
    # Enhance with brand voice and messaging
    if brand_guidelines:
        core_values = brand_guidelines.get('core_values', [])
        if core_values:
            persona_data['brand_alignment'] = {
                'core_values': core_values,
                'brand_voice': brand_guidelines.get('brand_voice', {})
            }
    
    if voice_tone:
        persona_data['communication_style'] = {
            'tone_attributes': voice_tone.get('core_voice_attributes', {}),
            'preferred_language': voice_tone.get('messaging_hierarchy', {}).get('power_words', [])
        }
    
    if messaging:
        value_props = messaging.get('core_positioning', {}).get('value_propositions', [])
        if value_props:
            persona_data['value_propositions'] = value_props
    
    # Enhance with program-specific data
    if programs and programs.get('programs'):
        for program in programs['programs']:
            if program.get('id') == program_id:
                persona_data['program_details'] = {
                    'format': program.get('format', 'Online'),
                    'duration': program.get('duration', 'Varies'),
                    'key_features': program.get('key_features', []),
                    'career_outcomes': program.get('career_outcomes', [])
                }
                break
    
    return persona_data

def create_university_campaign_optimization(university_config: dict) -> list:
    """Create campaign optimization files for all universities"""
    repo_root = Path.cwd()
    persona_data_dir = repo_root / "persona_data"
    
    actions_taken = []
    
    # Create comprehensive campaign strategy
    campaign_strategy_file = persona_data_dir / "UNIVERSITY_CAMPAIGN_STRATEGY.md"
    
    strategy_content = """# University Campaign Optimization Strategy

## Overview
Comprehensive campaign optimization based on persona analysis and university program requirements.

## University-Specific Strategies

"""
    
    for university in university_config.get("universities", []):
        uni_id = university["id"]
        uni_name = university["name"]
        
        strategy_content += f"""
### {uni_name} ({uni_id})

**Programs & Personas:**
"""
        
        for program in university.get("programs", []):
            program_name = program["name"]
            target_personas = program.get("target_personas", [])
            enrollment_goal = program.get("enrollment_goals", 100)
            
            strategy_content += f"""
- **{program_name}**
  - Target: {enrollment_goal} enrollments
  - Personas: {', '.join(target_personas)}
  - Priority: {program.get('priority', 'medium')}
"""
    
    strategy_content += """

## Campaign Recommendations

### Phase 1: Awareness (Weeks 1-4)
- LinkedIn thought leadership content for working professionals
- University partnership announcements
- Alumni success story campaigns

### Phase 2: Consideration (Weeks 5-8)
- Program-specific webinars and info sessions
- Personalized email nurture sequences
- Retargeting campaigns for website visitors

### Phase 3: Conversion (Weeks 9-12)
- Application deadline reminders
- Scholarship and financial aid promotions
- One-on-one consultation offers

## Success Metrics
- Cost per lead by persona type
- Conversion rate by program
- Attribution across touchpoints
- ROI by university partnership

## Next Actions
- [ ] Implement persona-specific ad creative
- [ ] Set up attribution tracking
- [ ] Launch pilot campaigns for highest-priority programs
- [ ] Monitor and optimize based on performance data

---
*Generated by PersonaOps ORDAE System*
"""
    
    with open(campaign_strategy_file, 'w') as f:
        f.write(strategy_content)
    
    actions_taken.append(f"Created campaign strategy: {campaign_strategy_file}")
    
    return actions_taken
